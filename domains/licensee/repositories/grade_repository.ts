import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, Grade } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateGradeDTO = Omit<Grade.Create, CommonFields>;
type UpdateGradeDTO = Omit<Grade.Update, CommonFields>;

export default class GradeRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'grades',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'grades'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'grades',
			where,
			transaction,
		});
	}

	create(payload: CreateGradeDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'grades',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'grades'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades', Col>]>,
		payload: UpdateGradeDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'grades',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'grades'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'grades',
			where,
			transaction,
		});
	}
}
