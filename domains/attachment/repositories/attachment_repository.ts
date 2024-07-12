import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#shared/repositories/abstract_repository';
import { date } from '#shared/services/date_factory';
import { generateUid } from '#shared/services/uid_generator';
import type { Attachment, DB } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateAttachmentDTO = Omit<Attachment.Create, CommonFields>;
type UpdateAttachmentDTO = Omit<Attachment.Update, CommonFields>;

export default class AttachmentRepository extends AbstractRepository {
	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'attachments',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'attachments'>>(
		where: ReadonlyArray<[Col, SelectValue<'attachments', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'attachments',
			where,
			transaction,
		});
	}

	create(payload: CreateAttachmentDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'attachments',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'attachments'>>(
		where: ReadonlyArray<[Col, SelectValue<'attachments', Col>]>,
		payload: UpdateAttachmentDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'attachments',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'attachments'>>(
		where: ReadonlyArray<[Col, SelectValue<'attachments', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'attachments',
			where,
			transaction,
		});
	}
}
