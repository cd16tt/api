import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const forgotPasswordSchema = SchemaFactory.create(
	vine.object({
		license: vine.string().regex(/^\d+$/),
		email: vine.string().email(),
	}),
	{
		'username.regex': 'Le numéro de licence doit être un nombre.',
		'email.email': "L'adresse e-mail doit être valide.",
	},
);

export type ForgotPasswordSchema = InferSchema<typeof forgotPasswordSchema>;
