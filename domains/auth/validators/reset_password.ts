import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const resetPasswordSchema = SchemaFactory.create(
	vine.object({
		password: vine.string(),
	}),
);

export type ResetPasswordSchema = InferSchema<typeof resetPasswordSchema>;
