import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class CheckLoginController extends AbstractController {
	constructor(private readonly licenseeRepository: LicenseeRepository) {
		super();
	}

	async handle({ auth, response }: HttpContext) {
		const authenticatedUser = auth.user!;
		const licensee = await this.licenseeRepository
			.findBy([['id', authenticatedUser.licenseeId]])
			.selectTakeFirst('firstname', 'lastname', 'code');

		if (!licensee) {
			return response.unauthorized({
				errors: [{ message: 'Aucun licencié associé à cet utilisateur.' }],
			});
		}

		return response.json({
			uid: authenticatedUser.uid,
			permissions: authenticatedUser.permissions,
			firstname: licensee.firstname,
			lastname: licensee.lastname,
			licenseCode: licensee.code,
		});
	}
}
