import { RuntimeException } from '@adonisjs/core/exceptions';

export default class InvitationExpiredException extends RuntimeException {
	constructor() {
		super("L'invitation a expiré", {
			status: 400,
			code: 'E_INVITATION_EXPIRED',
		});
	}
}
