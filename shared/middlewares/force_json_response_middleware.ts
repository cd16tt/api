import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class ForceJsonResponseMiddleware {
	handle({ request }: HttpContext, next: NextFn) {
		const headers = request.headers();
		headers.accept = 'application/json';

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
