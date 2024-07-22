import app from '@adonisjs/core/services/app';
import { defineConfig, stores } from '@adonisjs/session';

import env from '#start/env';

const sessionConfig = defineConfig({
	enabled: true,
	cookieName: env.get('SESSION_NAME') ?? 'adonis-session',
	clearWithBrowser: false,
	age: '2h',
	cookie: {
		path: '/',
		httpOnly: true,
		secure: app.inProduction,
		sameSite: 'lax',
		domain: env.get('SESSION_DOMAIN'),
	},
	store: env.get('SESSION_DRIVER'),
	stores: {
		cookie: stores.cookie(),
	},
});

export default sessionConfig;
