import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { ClubLicensee, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateClubLicenseeDTO = Omit<ClubLicensee.Create, CommonFields>;
type UpdateClubLicenseeDTO = Omit<ClubLicensee.Update, CommonFields>;

export default class ClubLicenseeRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'clubs_licensees',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'clubs_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'clubs_licensees',
			where,
			transaction,
		});
	}

	create(payload: CreateClubLicenseeDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'clubs_licensees',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'clubs_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_licensees', Col>]>,
		payload: UpdateClubLicenseeDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'clubs_licensees',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'clubs_licensees'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_licensees', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'clubs_licensees',
			where,
			transaction,
		});
	}
}
