import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class SilentAuthMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		await ctx.auth.check();

		if (ctx.auth.user) {
			ctx.sentry.setUser({
				id: ctx.auth.user.id,
				username: ctx.auth.user.username,
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
