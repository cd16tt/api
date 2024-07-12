import { defineConfig } from '@adonisjs/auth';
import { sessionGuard } from '@adonisjs/auth/session';
import { Authenticators, type InferAuthenticators, InferAuthEvents } from '@adonisjs/auth/types';
import { configProvider } from '@adonisjs/core';

const authConfig = defineConfig({
	default: 'web',
	guards: {
		web: sessionGuard({
			useRememberMeTokens: true,
			rememberMeTokensAge: '2w',
			provider: configProvider.create(async () => {
				const { SessionKyselyUserProvider } = await import('#domains/auth/providers/session_user_provider');
				return new SessionKyselyUserProvider();
			}),
		}),
	},
});

export default authConfig;

declare module '@adonisjs/auth/types' {
	interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
