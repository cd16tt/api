import router from '@adonisjs/core/services/router';
import server from '@adonisjs/core/services/server';

server.errorHandler(() => import('#shared/exceptions/handler'));

server.use([
	() => import('#shared/middlewares/container_bindings_middleware'),
	() => import('#shared/middlewares/force_json_response_middleware'),
	() => import('@adonisjs/cors/cors_middleware'),
	() => import('@adonisjs/static/static_middleware'),
	() => import('@adonisjs/cors/cors_middleware'),
]);

router.use([
	() => import('@rlanz/sentry/middleware'),
	() => import('@adonisjs/core/bodyparser_middleware'),
	() => import('@adonisjs/session/session_middleware'),
	() => import('@adonisjs/auth/initialize_auth_middleware'),
	() => import('#domains/auth/middlewares/initialize_bouncer_middleware'),
]);

export const middleware = router.named({
	auth: () => import('#domains/auth/middlewares/auth_middleware'),
	silentAuth: () => import('#domains/auth/middlewares/silent_auth_middleware'),
});
