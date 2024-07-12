import { Env } from '@adonisjs/core/env';
import app from '@adonisjs/core/services/app';

export default await Env.create(new URL('../', import.meta.url), {
	// Application configuration
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	PORT: Env.schema.number(),
	APP_NAME: Env.schema.string(),
	APP_KEY: Env.schema.string(),
	HOST: Env.schema.string({ format: 'host' }),
	LOG_LEVEL: Env.schema.string(),
	// Session configuration
	SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),
	// Database configuration
	POSTGRES_HOST: Env.schema.string(),
	POSTGRES_PORT: Env.schema.number(),
	POSTGRES_USER: Env.schema.string(),
	POSTGRES_PASSWORD: Env.schema.string(),
	POSTGRES_DB: Env.schema.string(),
	// Sentry configuration
	SENTRY_DSN: Env.schema.string(),
	// Mail common configuration
	MAILING_SENDER_NAME: Env.schema.string(),
	MAILING_SENDER_EMAIL: Env.schema.string(),
	MAILING_REPLY_TO_NAME: Env.schema.string(),
	MAILING_REPLY_TO_EMAIL: Env.schema.string(),
	// Mail brevo configuration
	BREVO_API_KEY: Env.schema.string(),
	// Mail smtp configuration
	SMTP_HOST: Env.schema.string(),
	SMTP_PORT: Env.schema.string(),
	SMTP_USERNAME: app.inProduction ? Env.schema.string() : Env.schema.string.optional(),
	SMTP_PASSWORD: app.inProduction ? Env.schema.string() : Env.schema.string.optional(),
	// Smartping configuration
	SMARTPING_ID: Env.schema.string(),
	SMARTPING_KEY: Env.schema.string(),
});
