import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class AuthMiddleware {
	handle(ctx: HttpContext, next: NextFn) {
		if (!ctx.auth.isAuthenticated) {
			ctx.response.unauthorized({ message: 'Unauthorized' });
		}

		try {
			const user = ctx.auth.getUserOrFail();
			ctx.sentry.setUser({
				id: user.id,
				username: user.username,
			});
			// eslint-disable-next-line no-empty
		} catch {}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
