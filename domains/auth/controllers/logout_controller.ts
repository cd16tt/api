import { HttpContext } from '@adonisjs/core/http';

import AbstractController from '#shared/controllers/abstract_controller';

export default class LogoutController extends AbstractController {
	async handle({ auth, response }: HttpContext) {
		await auth.use('web').logout();

		return response.noContent();
	}
}
