import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import InvitationService from '#domains/invitation/services/invitation_service';
import { createInvitationSchema } from '#domains/invitation/validators/invitation_validator';
import AbstractController from '#shared/controllers/abstract_controller';

@inject()
export default class CreateInvitationController extends AbstractController {
	constructor(private readonly invitationService: InvitationService) {
		super();
	}

	async handle({ auth, request, response }: HttpContext) {
		const authUser = auth.getUserOrFail();
		const payload = await request.validateUsing(createInvitationSchema);
		const invitation = await this.invitationService.create(payload, authUser);
		return response.created({
			uid: invitation.uid,
		});
	}
}
