import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import hash from '@adonisjs/core/services/hash';

import UserRepository from '#domains/auth/repositories/user_repository';
import { resetPasswordSchema } from '#domains/auth/validators/reset_password';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class ResetPasswordController extends AbstractController {
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

		const payload = await request.validateUsing(resetPasswordSchema);
		const hashedPassword = await hash.make(payload.password);

		const updatedUser = await this.userRepository
			.update([['reset_password_token', params['token']]], {
				reset_password_token: null,
				password: hashedPassword,
			})
			.returning('uid');

		if (!updatedUser) {
			return response.badRequest({
				errors: [{ message: 'Impossible de mettre à jour le mot de passe. Veuillez réessayer.' }],
			});
		}

		return response.noContent();
	}
}
