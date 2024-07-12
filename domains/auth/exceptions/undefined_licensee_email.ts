import { RuntimeException } from '@adonisjs/core/exceptions';

export default class UndefinedLicenseeEmailException extends RuntimeException {
	constructor() {
		super("La personne invitée n'a aucune adresse email associée", {
			status: 400,
			code: 'E_UNDEFINED_LICENSEE_EMAIL',
		});
	}
}
