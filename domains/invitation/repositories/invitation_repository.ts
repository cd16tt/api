import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, Invitation } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateInvitationDTO = Omit<Invitation.Create, CommonFields | 'expiresAt'>;
type UpdateInvitationDTO = Omit<Invitation.Update, CommonFields | 'expiresAt'>;

export default class InvitationRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'invitations',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'invitations'>>(
		where: ReadonlyArray<[Col, SelectValue<'invitations', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'invitations',
			where,
			transaction,
		});
	}

	create(payload: CreateInvitationDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'invitations',
			payload: {
				uid: generateUid(),
				...payload,
				expiresAt: date().plus({ days: 2 }).toSQL(),
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'invitations'>>(
		where: ReadonlyArray<[Col, SelectValue<'invitations', Col>]>,
		payload: UpdateInvitationDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'invitations',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'invitations'>>(
		where: ReadonlyArray<[Col, SelectValue<'invitations', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'invitations',
			where,
			transaction,
		});
	}
}
