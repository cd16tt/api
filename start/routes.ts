import router from '@adonisjs/core/services/router';

import { uidRegex } from '#shared/services/uid_generator';
import { middleware } from '#start/kernel';

const uidMatcher = { match: uidRegex };

const LoginController = () => import('#domains/auth/controllers/login_controller');
const LogoutController = () => import('#domains/auth/controllers/logout_controller');
const CreateInvitationController = () => import('#domains/invitation/controllers/create_invitation_controller');
const AcceptInvitationController = () => import('#domains/invitation/controllers/accept_invitation_controller');

router
	.group(() => {
		router.get('/', ({ response }) => {
			return response.json({ message: 'Welcome to the API' });
		});
		router.post('/auth/login', [LoginController]).as('auth.login');
		router.post('/invite/:uuid', [AcceptInvitationController]).where('uid', uidMatcher).as('invite.accept');
	})
	.middleware(middleware.silentAuth());

router
	.group(() => {
		router.post('/auth/logout', [LogoutController]).as('auth.logout');

		router.post('/invite', [CreateInvitationController]).as('invite.create');
	})
	.middleware(middleware.auth());
