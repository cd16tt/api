import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class AuthMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		await ctx.auth.authenticateUsing(['web']);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
