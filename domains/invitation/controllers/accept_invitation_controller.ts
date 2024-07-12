import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import InvitationRepository from '#domains/invitation/repositories/invitation_repository';
import InvitationService from '#domains/invitation/services/invitation_service';
import { acceptInvitationSchema } from '#domains/invitation/validators/invitation_validator';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import AbstractController from '#shared/controllers/abstract_controller';
import { getRequestUidOrFail } from '#shared/services/uid_generator';

@inject()
export default class AcceptInvitationController extends AbstractController {
	constructor(
		private readonly invitationService: InvitationService,
		private readonly invitationRepository: InvitationRepository,
		private readonly licenseeRepository: LicenseeRepository,
	) {
		super();
	}

	async handle({ request, response }: HttpContext) {
		const uid = getRequestUidOrFail(request, response);

		const invitation = await this.invitationRepository.findBy([['uid', uid]]).selectAllTakeFirst();

		if (!invitation) return;

		const licenseeEmail = await this.licenseeRepository.findBy([['id', invitation.licenseeId]]).selectTakeFirst('email');

		const payload = await request.validateUsing(acceptInvitationSchema);
		await this.invitationService.accept({
			invitation,
			payload,
			licenseeEmail: licenseeEmail?.email ?? null,
		});

		return response.created({
			uid: invitation.uid,
		});
	}
}
