import { errors, symbols } from '@adonisjs/auth';
import { RememberMeToken } from '@adonisjs/auth/session';
import { SessionGuardUser, SessionWithTokensUserProviderContract } from '@adonisjs/auth/types/session';
import { RuntimeException } from '@adonisjs/core/exceptions';
import { Secret } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';

import RememberMeTokenRepository from '#domains/auth/repositories/remember_me_token_repository';
import UserRepository from '#domains/auth/repositories/user_repository';
import { date } from '#shared/services/date_factory';
import type { User } from '#types/db';

export class SessionKyselyUserProvider implements SessionWithTokensUserProviderContract<User.Row> {
	declare [symbols.PROVIDER_REAL_USER]: User.Row;

	// eslint-disable-next-line @typescript-eslint/require-await
	async createUserForGuard(user: User.Row): Promise<SessionGuardUser<User.Row>> {
		return {
			getId() {
				return user.id;
			},
			getOriginal() {
				return user;
			},
		};
	}

	async findById(identifier: number): Promise<SessionGuardUser<User.Row> | null> {
		const userRepository = await app.container.make(UserRepository);
		const user = await userRepository.findBy([['id', identifier]]).selectAllTakeFirst();

		if (!user) {
			return null;
		}

		return this.createUserForGuard(user);
	}

	async createRememberToken(user: User.Row, expiresIn: string | number): Promise<RememberMeToken> {
		const transientToken = RememberMeToken.createTransientToken(user.id, 40, expiresIn);
		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);

		const token = await rememberMeTokenRepository
			.create({
				tokenableId: user.id,
				hash: transientToken.hash,
				expiresAt: date(transientToken.expiresAt).toSQL(),
			})
			.returningAllOrThrow();

		return new RememberMeToken({
			identifier: token.uid,
			hash: transientToken.hash,
			expiresAt: transientToken.expiresAt,
			tokenableId: user.id,
			secret: transientToken.secret,
			createdAt: token.createdAt,
			updatedAt: token.updatedAt,
		});
	}

	async verifyRememberToken(tokenValue: Secret<string>): Promise<RememberMeToken | null> {
		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);
		const decodedToken = RememberMeToken.decode(tokenValue.release());

		if (!decodedToken) {
			return null;
		}

		const token = await rememberMeTokenRepository.get(decodedToken.identifier).selectAllTakeFirst();

		if (!token) {
			return null;
		}

		const rememberMeToken = new RememberMeToken({
			identifier: token.uid,
			hash: token.hash,
			tokenableId: token.tokenableId,
			expiresAt: token.expiresAt,
			createdAt: token.createdAt,
			updatedAt: token.updatedAt,
		});

		const tokenIsVerified = rememberMeToken.verify(decodedToken.secret);

		if (!tokenIsVerified || rememberMeToken.isExpired()) {
			return null;
		}

		return rememberMeToken;
	}

	async recycleRememberToken(
		user: User.Row,
		tokenIdentifier: string | number | bigint,
		expiresIn: string | number,
	): Promise<RememberMeToken> {
		await this.deleteRemeberToken(user, tokenIdentifier);
		return this.createRememberToken(user, expiresIn);
	}

	async deleteRemeberToken(user: User.Row, tokenIdentifier: string | number | bigint): Promise<number> {
		if (typeof tokenIdentifier !== 'string') {
			throw new RuntimeException('Remember me token identifier must be a string');
		}

		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);
		const deletion = await rememberMeTokenRepository.delete(tokenIdentifier, user.id).executeTakeFirst();

		return Number(deletion.numDeletedRows);
	}

	async verifyCredentials(username: string, password: string): Promise<User.Row> {
		const userRepository = await app.container.make(UserRepository);
		const user = await userRepository.findBy([['username', username]]).selectAllTakeFirst();

		if (undefined === user) {
			throw new errors.E_INVALID_CREDENTIALS('Invalid credentials');
		}

		const passwordVerified = await hash.verify(user.password, password);

		if (!passwordVerified) {
			throw new errors.E_INVALID_CREDENTIALS('Invalid credentials');
		}

		return user;
	}
}
