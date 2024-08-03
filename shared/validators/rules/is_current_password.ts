import hash from '@adonisjs/core/services/hash';
import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { isString } from 'radash';

import { db } from '#shared/services/database';

export const isCurrentPassword = vine.createRule(
	async (value: unknown, _options: undefined, field: FieldContext) => {
		if (!field.isValid) return;

		if (!value || !isString(value)) return;

		const dbRequest = await db.selectFrom('users').where('id', '=', field.meta['userId']).select('password').executeTakeFirst();

		if (!dbRequest) {
			field.report('Impossible de vérifier le mot de passe actuel.', 'security.isCurrentPassword', field);

			return;
		}

		const isSame = await hash.verify(dbRequest?.password, value);

		if (!isSame) {
			field.report('Le mot de passe ne correspond pas à celui déjà enregistré.', 'security.isCurrentPassword', field);
		}
	},
	{ implicit: true, isAsync: true },
);
