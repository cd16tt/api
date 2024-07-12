import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { Address, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateAddressDTO = Omit<Address.Create, CommonFields>;
type UpdateAddressDTO = Omit<Address.Update, CommonFields>;

export default class AddressRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'addresses',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'addresses'>>(
		where: ReadonlyArray<[Col, SelectValue<'addresses', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'addresses',
			where,
			transaction,
		});
	}

	create(payload: CreateAddressDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'addresses',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'addresses'>>(
		where: ReadonlyArray<[Col, SelectValue<'addresses', Col>]>,
		payload: UpdateAddressDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'addresses',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'addresses'>>(
		where: ReadonlyArray<[Col, SelectValue<'addresses', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'addresses',
			where,
			transaction,
		});
	}
}
