import AbstractEmail from '#shared/emails/abstract_email';
import { Uid } from '#shared/services/uid_generator';

type InvitationEmailProps = {
	recipient: {
		email: string;
		name: string;
	};
	invitationId: Uid;
};

export default class InvitationEmail extends AbstractEmail {
	override subject = '';

	constructor(private readonly props: InvitationEmailProps) {
		super();
	}

	prepare() {
		this.message.to(this.props.recipient.email);
		this.message.htmlView('emails/invitation.mjml', {
			invitationId: this.props.invitationId,
			recipientName: this.props.recipient.name,
		});
	}
}
