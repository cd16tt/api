import { BaseMail } from '@adonisjs/mail';

import env from '#start/env';

export default abstract class AbstractEmail extends BaseMail {
	override from = {
		name: env.get('MAILING_SENDER_NAME'),
		address: env.get('MAILING_SENDER_EMAIL'),
	};

	override replyTo = {
		name: env.get('MAILING_REPLY_TO_NAME'),
		address: env.get('MAILING_REPLY_TO_EMAIL'),
	};
}
