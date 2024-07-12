import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { Club, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateClubDTO = Omit<Club.Create, CommonFields>;
type UpdateClubDTO = Omit<Club.Update, CommonFields>;

export default class ClubRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'clubs',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'clubs'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'clubs',
			where,
			transaction,
		});
	}

	create(payload: CreateClubDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'clubs',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'clubs'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs', Col>]>,
		payload: UpdateClubDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'clubs',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'clubs'>>(
		where: ReadonlyArray<[Col, SelectValue<'clubs', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'clubs',
			where,
			transaction,
		});
	}

	async getAllClubCodes(transaction?: Transaction<DB>) {
		const clubs = await this.$findAll({
			table: 'clubs',
			transaction,
		}).select('id', 'code');

		// eslint-disable-next-line unicorn/no-array-reduce
		return clubs.reduce<Record<string, number>>((acc, club) => {
			acc[club.code] = club.id;
			return acc;
		}, {});
	}
}
