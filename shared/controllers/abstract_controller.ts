import type { HttpContext } from '@adonisjs/core/http';

export default abstract class AbstractController {
	abstract handle(httpContext: HttpContext): Promise<void>;
}
