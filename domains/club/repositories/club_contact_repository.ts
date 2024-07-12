import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { ClubContact, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateClubContactDTO = Omit<ClubContact.Create, CommonFields>;
type UpdateClubContactDTO = Omit<ClubContact.Update, CommonFields>;

export default class ClubContactRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'club_contacts',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'club_contacts'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_contacts', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'club_contacts',
			where,
			transaction,
		});
	}

	create(payload: CreateClubContactDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'club_contacts',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'club_contacts'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_contacts', Col>]>,
		payload: UpdateClubContactDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'club_contacts',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'club_contacts'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_contacts', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'club_contacts',
			where,
			transaction,
		});
	}
}
