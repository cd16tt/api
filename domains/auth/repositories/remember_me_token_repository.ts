import type { Transaction } from 'kysely';

import AbstractRepository from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import type { Uid } from '#shared/services/uid_generator';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, RememberMeToken } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateRememberMeTokenDTO = Omit<RememberMeToken.Create, CommonFields>;

export default class RememberMeTokenRepository extends AbstractRepository {
	get(identifier: Uid, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'remember_me_tokens',
			where: [['uid', identifier]],
			transaction,
		});
	}

	create(payload: CreateRememberMeTokenDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'remember_me_tokens',
			transaction,
			payload: {
				uid: generateUid(),
				tokenableId: payload.tokenableId,
				hash: payload.hash,
				expiresAt: date(payload.expiresAt).toSQL(),
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
		});
	}

	delete(identifier: Uid, userId: number, transaction?: Transaction<DB>) {
		return this.$delete({
			table: 'remember_me_tokens',
			where: [
				['uid', identifier],
				['tokenableId', userId],
			],
			transaction,
		});
	}
}
