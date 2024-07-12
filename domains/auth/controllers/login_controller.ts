import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import { SessionKyselyUserProvider } from '#domains/auth/providers/session_user_provider';
import { loginSchema } from '#domains/auth/validators/login';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class LoginController extends AbstractController {
	constructor(private readonly sessionUserProvider: SessionKyselyUserProvider) {
		super();
	}

	async handle(httpContext: HttpContext) {
		const { auth, request, response } = httpContext;
		const payload = await request.validateUsing(loginSchema);
		const user = await this.sessionUserProvider.verifyCredentials(payload.username, payload.password.release());

		await auth.use('web').login(user, payload.remember);

		return response.json({
			uid: user.uid,
		});
	}
}
