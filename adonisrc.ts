import { defineConfig } from '@adonisjs/core/app';

export default defineConfig({
	commands: [
		() => import('@adonisjs/core/commands'),
		() => import('@adonisjs/bouncer/commands'),
		() => import('@adonisjs/mail/commands'),
	],
	providers: [
		() => import('@adonisjs/core/providers/app_provider'),
		() => import('@adonisjs/core/providers/hash_provider'),
		{
			file: () => import('@adonisjs/core/providers/repl_provider'),
			environment: ['repl', 'test'],
		},
		() => import('@adonisjs/core/providers/vinejs_provider'),
		() => import('@adonisjs/core/providers/edge_provider'),
		() => import('@adonisjs/cors/cors_provider'),
		() => import('@adonisjs/session/session_provider'),
		() => import('@adonisjs/auth/auth_provider'),
		() => import('@adonisjs/bouncer/bouncer_provider'),
		() => import('@adonisjs/static/static_provider'),
		() => import('@adonisjs/mail/mail_provider'),
		() => import('@adonisjs/transmit/transmit_provider'),
		() => import('@rlanz/sentry/provider'),
		() => import('#shared/providers/database_provider'),
		() => import('#shared/providers/validator_provider'),
	],
	preloads: [() => import('#start/routes'), () => import('#start/kernel'), () => import('#start/view')],
	tests: {
		suites: [
			{
				files: ['./{domains,shared,tests}/**/*.spec.ts'],
				name: 'unit',
				timeout: 2000,
			},
			{
				files: ['./{domains,shared,tests}/**/*.test.ts'],
				name: 'functional',
				timeout: 30_000,
			},
		],
		forceExit: false,
	},
	metaFiles: [
		{
			pattern: 'resources/views/**/*.edge',
			reloadServer: false,
		},
		{
			pattern: 'public/**',
			reloadServer: false,
		},
	],
});
