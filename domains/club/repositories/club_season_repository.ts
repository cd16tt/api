import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { ClubSeason, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateClubSeasonDTO = Omit<ClubSeason.Create, CommonFields>;
type UpdateClubSeasonDTO = Omit<ClubSeason.Update, CommonFields>;

export default class ClubSeasonRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'clubs_seasons',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'clubs_seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_seasons', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'clubs_seasons',
			where,
			transaction,
		});
	}

	create(payload: CreateClubSeasonDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'clubs_seasons',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'clubs_seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_seasons', Col>]>,
		payload: UpdateClubSeasonDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'clubs_seasons',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'clubs_seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs_seasons', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'clubs_seasons',
			where,
			transaction,
		});
	}
}
