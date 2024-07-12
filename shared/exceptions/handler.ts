import { ExceptionHandler, HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';

export default class HttpExceptionHandler extends ExceptionHandler {
	/**
	 * In debug mode, the exception handler will display verbose errors
	 * with pretty printed stack traces.
	 */
	protected override debug = !app.inProduction;

	/**
	 * The method is used for handling errors and returning
	 * response to the client
	 */
	override async handle(error: unknown, ctx: HttpContext) {
		return super.handle(error, ctx);
	}

	/**
	 * The method is used to report error to the logging service or
	 * a third party error monitoring service.
	 *
	 * @note You should not attempt to send a response from this method.
	 */
	override async report(error: unknown, ctx: HttpContext) {
		if (this.shouldReport(error as never)) {
			ctx.sentry.captureException(error);
		}

		return super.report(error, ctx);
	}
}
