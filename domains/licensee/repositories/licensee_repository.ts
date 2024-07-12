import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, Licensee } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateLicenseeDTO = Omit<Licensee.Create, CommonFields>;
type UpdateLicenseeDTO = Omit<Licensee.Update, CommonFields>;

export default class LicenseeRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'licensees',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'licensees',
			where,
			transaction,
		});
	}

	create(payload: CreateLicenseeDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'licensees',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'licensees', Col>]>,
		payload: UpdateLicenseeDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'licensees',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'licensees',
			where,
			transaction,
		});
	}
}
