import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import { type DB, User } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateUserDTO = Omit<User.Create, CommonFields>;
type UpdateUserDTO = Omit<User.Update, CommonFields>;

export default class UserRepository extends AbstractRepository {
	get query() {
		return {
			select: (transaction?: Transaction<DB>) => this.$selectQuery({ table: 'users', transaction }),
			update: (transaction?: Transaction<DB>) => this.$updateQuery({ table: 'users', transaction }),
			delete: (transaction?: Transaction<DB>) => this.$deleteQuery({ table: 'users', transaction }),
		};
	}

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

	create(payload: CreateUserDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'users',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'users'>>(
		where: ReadonlyArray<[Col, SelectValue<'users', Col>]>,
		payload: UpdateUserDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'users',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
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
