import { Secret } from '@adonisjs/core/helpers';
import { defineConfig } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';

import env from '#start/env';

export const appKey = new Secret(env.get('APP_KEY'));

export const http = defineConfig({
	generateRequestId: true,
	allowMethodSpoofing: false,
	useAsyncLocalStorage: true,
	cookie: {
		domain: env.get('SESSION_DOMAIN'),
		path: '/',
		maxAge: '2h',
		httpOnly: true,
		secure: app.inProduction,
		sameSite: 'lax',
	},
});
