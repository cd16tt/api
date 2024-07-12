import { RuntimeException } from '@adonisjs/core/exceptions';

export default class AppException extends RuntimeException {
	static matches(error: unknown) {
		return error instanceof this;
	}
}
