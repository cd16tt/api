import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, Season } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateSeasonDTO = Omit<Season.Create, CommonFields>;
type UpdateSeasonDTO = Omit<Season.Update, CommonFields>;

export default class SeasonRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'seasons',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'seasons', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'seasons',
			where,
			transaction,
		});
	}

	create(payload: CreateSeasonDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'seasons',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'seasons', Col>]>,
		payload: UpdateSeasonDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'seasons',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'seasons'>>(
		where: ReadonlyArray<[Col, SelectValue<'seasons', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'seasons',
			where,
			transaction,
		});
	}

	getCurrentSeason(transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'seasons',
			where: [['isCurrent', true]],
			transaction,
		});
	}
}
