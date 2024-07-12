import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, Hall } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateHallDTO = Omit<Hall.Create, CommonFields>;
type UpdateHallDTO = Omit<Hall.Update, CommonFields>;

export default class HallRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'halls',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'halls'>>(
		where: ReadonlyArray<[Col, SelectValue<'halls', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'halls',
			where,
			transaction,
		});
	}

	create(payload: CreateHallDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'halls',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'halls'>>(
		where: ReadonlyArray<[Col, SelectValue<'halls', Col>]>,
		payload: UpdateHallDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'halls',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'halls'>>(
		where: ReadonlyArray<[Col, SelectValue<'halls', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'halls',
			where,
			transaction,
		});
	}
}
