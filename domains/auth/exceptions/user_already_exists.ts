import AppException from '#shared/exceptions/app_exception';

export default class UserAlreadyExistsException extends AppException {
	constructor() {
		super('Un utilisateur existe déjà avec cet identifiant', {
			status: 400,
			code: 'E_USER_ALREADY_EXISTS',
		});
	}
}
