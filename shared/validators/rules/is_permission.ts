import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { isString } from 'radash';

import { flatPermissions, Permission } from '#domains/auth/value_objects/security';

export const isPermission = vine.createRule((value: unknown, _options: undefined, field: FieldContext) => {
	if (!field.isValid) return;

	if (!value || !isString(value)) return;

	if (flatPermissions.includes(value as Permission)) return;

	field.report('The selected {{ field }} is invalid', 'security.isPermission', field);
});
