import { Secret } from '@adonisjs/core/helpers';
import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const loginSchema = SchemaFactory.create(
	vine.object({
		username: vine.string(),
		password: vine
			.string()
			.minLength(8)
			.transform((value) => new Secret(value)),
		remember: vine.boolean().optional(),
	}),
	{
		'username.regex': 'Le numéro de licence doit être un nombre.',
		'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
	},
);

export type LoginSchema = InferSchema<typeof loginSchema>;
