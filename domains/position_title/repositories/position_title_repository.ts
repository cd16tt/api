import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { DB, PositionTitle } from '#types/db';
import type { CommonFields } from '#types/index';

type CreatePositionTitleDTO = Omit<PositionTitle.Create, CommonFields>;
type UpdatePositionTitleDTO = Omit<PositionTitle.Update, CommonFields>;

export default class PositionTitleRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'position_titles',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'position_titles'>>(
		where: ReadonlyArray<[Col, SelectValue<'position_titles', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'position_titles',
			where,
			transaction,
		});
	}

	create(payload: CreatePositionTitleDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'position_titles',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'position_titles'>>(
		where: ReadonlyArray<[Col, SelectValue<'position_titles', Col>]>,
		payload: UpdatePositionTitleDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'position_titles',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'position_titles'>>(
		where: ReadonlyArray<[Col, SelectValue<'position_titles', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'position_titles',
			where,
			transaction,
		});
	}
}
