import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import hash from '@adonisjs/core/services/hash';

import UserRepository from '#domains/auth/repositories/user_repository';
import { updatePasswordSchema } from '#domains/auth/validators/update_password';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class UpdatePasswordController extends AbstractController {
	constructor(private readonly userRepository: UserRepository) {
		super();
	}

	async handle({ auth, request, response }: HttpContext) {
		const authenticatedUser = auth.user!;
		const payload = await request.validateUsing(updatePasswordSchema, { meta: { userId: authenticatedUser.id } });

		const hashedPassword = await hash.make(payload.newPassword);

		await this.userRepository.update([['id', authenticatedUser.id]], { password: hashedPassword }).executeTakeFirst();

		return response.noContent();
	}
}
