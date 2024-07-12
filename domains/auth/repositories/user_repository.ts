import hash from '@adonisjs/core/services/hash';
import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import { type DB, User } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateUserDTO = Omit<User.Create, CommonFields>;
type UpdateUserDTO = Omit<User.Update, CommonFields>;

export default class UserRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'users',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'users'>>(
		where: ReadonlyArray<[Col, SelectValue<'users', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'users',
			where,
			transaction,
		});
	}

	async create(payload: CreateUserDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'users',
			payload: {
				uid: generateUid(),
				...payload,
				password: await hash.make(payload.password),
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	async update<Col extends SelectColumn<'users'>>(
		where: ReadonlyArray<[Col, SelectValue<'users', Col>]>,
		payload: UpdateUserDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'users',
			where,
			payload: payload.password
				? { ...payload, password: await hash.make(payload.password), updatedAt: date().toSQL() }
				: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'users'>>(
		where: ReadonlyArray<[Col, SelectValue<'users', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'users',
			where,
			transaction,
		});
	}
}
