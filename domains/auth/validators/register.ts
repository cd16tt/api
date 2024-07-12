import { Secret } from '@adonisjs/core/helpers';
import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const registerSchema = SchemaFactory.create(
	vine.object({
		username: vine.string().regex(/^\d+$/),
		password: vine
			.string()
			.minLength(8)
			.transform((value) => new Secret(value)),
	}),
	{
		'username.regex': 'Le numéro de licence doit être un nombre.',
		'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
	},
);

export type RegisterSchema = InferSchema<typeof registerSchema>;
