import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { ClubSocial, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateClubSocialDTO = Omit<ClubSocial.Create, CommonFields>;
type UpdateClubSocialDTO = Omit<ClubSocial.Update, CommonFields>;

export default class ClubSocialRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'club_socials',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'club_socials'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_socials', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'club_socials',
			where,
			transaction,
		});
	}

	create(payload: CreateClubSocialDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'club_socials',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'club_socials'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_socials', Col>]>,
		payload: UpdateClubSocialDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'club_socials',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'club_socials'>>(
		where: ReadonlyArray<[Col, SelectValue<'club_socials', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'club_socials',
			where,
			transaction,
		});
	}
}
