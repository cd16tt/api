import vine from '@vinejs/vine';

import { isCurrentPassword } from '#shared/validators/rules/is_current_password';
import { isSafePassword } from '#shared/validators/rules/is_safe_password';
import { SchemaFactory } from '#shared/validators/schema_factory';

export const updatePasswordSchema = SchemaFactory.createWithMetadata<{ userId: number }>()(
	vine.object({
		oldPassword: vine.string().use(isCurrentPassword()),
		newPassword: vine.string().use(isSafePassword()),
	}),
	{},
);
