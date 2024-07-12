import { inject } from '@adonisjs/core';

import UndefinedLicenseeEmailException from '#domains/auth/exceptions/undefined_licensee_email';
import UserAlreadyExistsException from '#domains/auth/exceptions/user_already_exists';
import UserRepository from '#domains/auth/repositories/user_repository';
import { Permission } from '#domains/auth/value_objects/security';
import InvitationExpiredException from '#domains/invitation/exceptions/invitation_expired';
import InvitationRepository from '#domains/invitation/repositories/invitation_repository';
import type { CreateInvitationSchema } from '#domains/invitation/validators/invitation_validator';
import { AcceptInvitationSchema } from '#domains/invitation/validators/invitation_validator';
import { date } from '#shared/services/date_factory';
import { Invitation, User } from '#types/db';

type ActionParameters = {
	invitation: Invitation.Row;
	licenseeEmail: string | null;
	payload: AcceptInvitationSchema;
};

@inject()
export default class InvitationService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly invitationRepository: InvitationRepository,
	) {}

	async create(payload: CreateInvitationSchema, authUser: User.Row) {
		const existingUser = await this.userRepository.findBy([['licenseeId', payload.licenseeId]]).selectTakeFirst('id');

		if (existingUser !== undefined) {
			throw new UserAlreadyExistsException();
		}

		return this.invitationRepository
			.create({
				...payload,
				permissions: payload.permissions as Array<Permission>,
				createdById: authUser.id,
				updatedById: authUser.id,
			})
			.returningOrThrow('uid');
	}

	async accept({ invitation, licenseeEmail, payload }: ActionParameters) {
		if (invitation.expiresAt < date()) {
			throw new InvitationExpiredException();
		}

		if (licenseeEmail === null) {
			throw new UndefinedLicenseeEmailException();
		}

		const user = await this.userRepository.create({
			...invitation,
			username: payload.username,
			password: payload.password.release(),
		});

		await this.invitationRepository.delete([['id', invitation.id]]).returning('id');

		return user;
	}
}
