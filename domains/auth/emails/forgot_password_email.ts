import AbstractEmail from '#shared/emails/abstract_email';

interface EmailProps {
	to: {
		email: string;
		firstname: string;
	};
	link: string;
}

export default class ForgotPasswordEmail extends AbstractEmail {
	constructor(private readonly props: EmailProps) {
		super();
	}

	prepare() {
		this.message.to(this.props.to.email, this.props.to.firstname);
		this.message.htmlView('auth::forgot_password.mjml', { link: this.props.link });
	}
}
