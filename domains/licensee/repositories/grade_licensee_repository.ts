import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, GradeLicensee } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateGradeLicenseeDTO = Omit<GradeLicensee.Create, CommonFields>;
type UpdateGradeLicenseeDTO = Omit<GradeLicensee.Update, CommonFields>;

export default class GradeLicenseeRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'grades_licensees',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'grades_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades_licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'grades_licensees',
			where,
			transaction,
		});
	}

	create(payload: CreateGradeLicenseeDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'grades_licensees',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'grades_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades_licensees', Col>]>,
		payload: UpdateGradeLicenseeDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'grades_licensees',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'grades_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'grades_licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'grades_licensees',
			where,
			transaction,
		});
	}
}
