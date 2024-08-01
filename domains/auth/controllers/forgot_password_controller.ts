import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
import mail from '@adonisjs/mail/services/main';

import ForgotPasswordEmail from '#domains/auth/emails/forgot_password_email';
import UserRepository from '#domains/auth/repositories/user_repository';
import { forgotPasswordSchema } from '#domains/auth/validators/forgot_password';
import AbstractController from '#shared/controllers/abstract_controller';
import { generateUid } from '#shared/services/uid_generator';
import env from '#start/env';

@inject()
export default class ForgotPasswordController extends AbstractController {
	constructor(private readonly userRepository: UserRepository) {
		super();
	}

	async handle(httpContext: HttpContext) {
		const { request, response } = httpContext;
		const payload = await request.validateUsing(forgotPasswordSchema);
		const account = await this.userRepository.query
			.select()
			.innerJoin('licensees', 'users.licenseeId', 'licensees.id')
			.where('licensees.email', '=', payload.email)
			.where('licensees.code', '=', payload.license)
			.select(['users.uid', 'licensees.firstname', 'licensees.email'])
			.executeTakeFirst();

		if (!account) {
			return response.badRequest({
				errors: [{ message: 'Aucun compte trouvé.' }],
			});
		}

		const resetToken = generateUid();
		await this.userRepository.update([['uid', account.uid]], { reset_password_token: resetToken }).execute();

		const resetLink = router
			.builder()
			.params({ token: resetToken })
			.prefixUrl(env.get('PUBLIC_URL'))
			.makeSigned('auth.reset_password', { expiresIn: '2h' });

		const emailLink = new URL(`${env.get('FRONTEND_URL')}/auth/reset-password/${resetToken}`);
		emailLink.searchParams.append('signature', new URL(resetLink).searchParams.get('signature')!);

		await mail.send(
			new ForgotPasswordEmail({
				to: {
					email: account.email!,
					firstname: account.firstname,
				},
				link: emailLink.toString(),
			}),
		);

		return response.noContent();
	}
}
