import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

import { Bouncer } from '@adonisjs/bouncer';

/**
 * Init bouncer middleware is used to create a bouncer instance
 * during an HTTP request
 */
export default class InitializeBouncerMiddleware {
	handle(ctx: HttpContext, next: NextFn) {
		ctx.bouncer = new Bouncer(() => ctx.auth.user ?? null, undefined, undefined).setContainerResolver(ctx.containerResolver);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}

declare module '@adonisjs/core/http' {
	export interface HttpContext {
		bouncer: Bouncer<Exclude<HttpContext['auth']['user'], undefined>>;
	}
}
