import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import UserRepository from '#domains/auth/repositories/user_repository';
import { updateUsernameSchema } from '#domains/auth/validators/update_username';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class UpdateUsernameController extends AbstractController {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly licenseeRepository: LicenseeRepository,
	) {
		super();
	}

	async handle({ auth, request, response }: HttpContext) {
		const authenticatedUser = auth.user!;
		const payload = await request.validateUsing(updateUsernameSchema);

		const updatedUser = await this.userRepository
			.update([['id', authenticatedUser.id]], { username: payload.username })
			.returningAll();

		if (!updatedUser) {
			return response.badRequest({
				errors: [{ message: "Impossible de mettre à jour le nom d'utilisateur." }],
			});
		}

		await auth.use('web').login(updatedUser);

		const licensee = await this.licenseeRepository
			.findBy([['id', auth.user!.licenseeId]])
			.selectTakeFirst('firstname', 'lastname', 'code');

		if (!licensee) {
			return response.badRequest({
				errors: [{ message: 'Aucun licencié associé à cet utilisateur.' }],
			});
		}

		return response.json({
			uid: auth.user!.uid,
			permissions: auth.user!.permissions,
			firstname: licensee.firstname,
			lastname: licensee.lastname,
			licenseCode: licensee.code,
		});
	}
}
