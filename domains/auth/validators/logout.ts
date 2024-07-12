import vine from '@vinejs/vine';

import { InferSchema, SchemaFactory } from '#shared/validators/schema_factory';

export const logoutSchema = SchemaFactory.create(vine.object({}));

export type LogoutSchema = InferSchema<typeof logoutSchema>;
