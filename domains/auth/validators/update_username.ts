import vine from '@vinejs/vine';

import { SchemaFactory } from '#shared/validators/schema_factory';

export const updateUsernameSchema = SchemaFactory.create(
	vine.object({
		username: vine
			.string()
			.alphaNumeric({ allowDashes: true, allowUnderscores: true })
			.unique(async (db, value) => {
				const result = await db.selectFrom('users').where('username', '=', value).select('id').executeTakeFirst();

				return result?.id === undefined;
			}),
	}),
	{
		'username.alphaNumeric': "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres, et les caractères '-' et '_'.",
		'username.unique': "Ce nom d'utilisateur est déjà pris. Veillez en choisir un autre.",
	},
);
