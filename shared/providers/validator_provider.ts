import type { ApplicationService } from '@adonisjs/core/types';

import { VineString } from '@vinejs/vine';

declare module '@vinejs/vine' {
	interface VineString {
		isPermission(): this;

		isCurrentPassword(): this;

		isSafePassword(): this;
	}
}

export default class ValidatorServiceProvider {
	constructor(protected app: ApplicationService) {}

	async boot() {
		if (this.app.usingVineJS) {
			const { isPermission } = await import('#shared/validators/rules/is_permission');
			const { isCurrentPassword } = await import('#shared/validators/rules/is_current_password');
			const { isSafePassword } = await import('#shared/validators/rules/is_safe_password');

			VineString.macro('isPermission', function (this: VineString) {
				return this.use(isPermission());
			});

			VineString.macro('isCurrentPassword', function (this: VineString) {
				return this.use(isCurrentPassword());
			});

			VineString.macro('isSafePassword', function (this: VineString) {
				return this.use(isSafePassword());
			});
		}
	}
}
