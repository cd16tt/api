import type { ApplicationService } from '@adonisjs/core/types';

declare module '@vinejs/vine' {
	interface VineString {
		isPermission(): this;
	}
}

export default class ValidatorServiceProvider {
	constructor(protected app: ApplicationService) {}

	async boot() {
		if (this.app.usingVineJS) {
			const { defineExtraValidationRules } = await import('#shared/validators/extra_rules');
			defineExtraValidationRules();
		}
	}
}
