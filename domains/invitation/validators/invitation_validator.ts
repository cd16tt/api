import { Secret } from '@adonisjs/core/helpers';
import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const acceptInvitationSchema = SchemaFactory.create(
	vine.object({
		username: vine.string().unique(async (db, value) => {
			const result = await db.selectFrom('users').where('username', '=', value).select('id').executeTakeFirst();

			return result?.id === undefined;
		}),
		password: vine
			.string()
			.minLength(8)
			.transform((value) => new Secret(value)),
	}),
	{
		'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
	},
);

export const createInvitationSchema = SchemaFactory.create(
	vine.object({
		licenseeId: vine.number().exists(async (db, value) => {
			const result = await db.selectFrom('licensees').where('id', '=', value).select('id').executeTakeFirst();

			return result?.id !== undefined;
		}),
		email: vine.string().email(),
		permissions: vine.array(vine.string().isPermission()),
	}),
	{
		'email.email': "Le format de l'adresse email n'est pas valide.",
		'permissions.array': "L'invitation doit contenir au moins une permission.",
		'permissions.array.*.isPermission': "La permission {{ value }} n'est pas valide.",
	},
);

export type AcceptInvitationSchema = InferSchema<typeof acceptInvitationSchema>;
export type CreateInvitationSchema = InferSchema<typeof createInvitationSchema>;
