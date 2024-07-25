import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import { SessionKyselyUserProvider } from '#domains/auth/providers/session_user_provider';
import { loginSchema } from '#domains/auth/validators/login';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class LoginController extends AbstractController {
	constructor(
		private readonly sessionUserProvider: SessionKyselyUserProvider,
		private readonly licenseeRepository: LicenseeRepository,
	) {
		super();
	}

	async handle(httpContext: HttpContext) {
		const { auth, request, response } = httpContext;
		const payload = await request.validateUsing(loginSchema);
		const user = await this.sessionUserProvider.verifyCredentials(payload.username, payload.password.release());

		await auth.use('web').login(user, payload.remember);

		const licensee = await this.licenseeRepository
			.findBy([['id', auth.user!.licenseeId]])
			.selectTakeFirst('firstname', 'lastname', 'code');

		if (!licensee) {
			return response.unauthorized({
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
