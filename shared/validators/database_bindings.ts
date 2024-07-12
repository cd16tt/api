import vine, { VineNumber, VineString } from '@vinejs/vine';
import { Kysely } from 'kysely';
import { isNumber, isString } from 'radash';

import type { DB } from '#types/db';

/**
 * Defines the "unique" and "exists" validation rules with
 * VineJS.
 */
export function defineValidationRules(db: Kysely<DB>) {
	const uniqueRule = vine.createRule<Parameters<VineString['unique'] | VineNumber['unique']>[0]>(
		async (value, checker, field) => {
			if (!field.isValid) {
				return;
			}

			if (!value || !isString(value) || !isNumber(value)) {
				return;
			}

			const isUnique = await checker(db, value, field);
			if (!isUnique) {
				field.report('The {{ field }} has already been taken', 'database.unique', field);
			}
		},
	);

	const existsRule = vine.createRule<Parameters<VineString['exists'] | VineNumber['exists']>[0]>(
		async (value, checker, field) => {
			if (!field.isValid) {
				return;
			}

			if (!value || !isString(value) || !isNumber(value)) {
				return;
			}

			const exists = await checker(db, value, field);
			if (!exists) {
				field.report('The selected {{ field }} is invalid', 'database.exists', field);
			}
		},
	);

	VineString.macro('unique', function (this: VineString, checker) {
		return this.use(uniqueRule(checker));
	});

	VineString.macro('exists', function (this: VineString, checker) {
		return this.use(existsRule(checker));
	});

	VineNumber.macro('unique', function (this: VineNumber, checker) {
		return this.use(uniqueRule(checker));
	});

	VineNumber.macro('exists', function (this: VineNumber, checker) {
		return this.use(existsRule(checker));
	});
}
