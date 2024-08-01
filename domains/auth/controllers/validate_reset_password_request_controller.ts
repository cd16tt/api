import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import UserRepository from '#domains/auth/repositories/user_repository';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class ValidateResetPasswordRequestController extends AbstractController {
	constructor(private readonly userRepository: UserRepository) {
		super();
	}

	async handle(httpContext: HttpContext) {
		const { params, request, response } = httpContext;

		if (!request.hasValidSignature()) {
			return response.badRequest({
				errors: [{ message: 'La demande de réinitialisation est invalide ou a expiré.' }],
			});
		}

		const account = await this.userRepository
			.findBy([['resetPasswordToken', params['token']]])
			.selectTakeFirst('resetPasswordToken');

		if (!account?.resetPasswordToken) {
			return response.notFound({
				errors: [{ message: 'Demande de réinitialisation introuvable. Veuillez recommencer.' }],
			});
		}

		return response.noContent();
	}
}
