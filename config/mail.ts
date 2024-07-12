import app from '@adonisjs/core/services/app';
import { defineConfig, transports } from '@adonisjs/mail';
import { InferMailers, SMTPConfig } from '@adonisjs/mail/types';

import env from '#start/env';

const smtpConfig: SMTPConfig = {
	host: env.get('SMTP_HOST'),
	port: env.get('SMTP_PORT'),
};

if (app.inProduction) {
	smtpConfig.auth = {
		type: 'login',
		user: env.get('SMTP_USERNAME') ?? '',
		pass: env.get('SMTP_PASSWORD') ?? '',
	};
}

const mailConfig = defineConfig({
	default: 'smtp',
	mailers: {
		smtp: transports.smtp(smtpConfig),

		brevo: transports.brevo({
			key: env.get('BREVO_API_KEY'),
			baseUrl: 'https://api.brevo.com/v3',
		}),
	},
});

export default mailConfig;

declare module '@adonisjs/mail/types' {
	export interface MailersList extends InferMailers<typeof mailConfig> {}
}
