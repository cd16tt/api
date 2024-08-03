import router from '@adonisjs/core/services/router';

import { uidRegex } from '#shared/services/uid_generator';
import { middleware } from '#start/kernel';

const uidMatcher = { match: uidRegex };

// Authentication
const LoginController = () => import('#domains/auth/controllers/login_controller');
const LogoutController = () => import('#domains/auth/controllers/logout_controller');
const CheckLoginController = () => import('#domains/auth/controllers/check_login_controller');
const ForgotPasswordController = () => import('#domains/auth/controllers/forgot_password_controller');
const ValidateResetPasswordRequestController = () =>
	import('#domains/auth/controllers/validate_reset_password_request_controller');
const ResetPasswordController = () => import('#domains/auth/controllers/reset_password_controller');
const UpdatePasswordController = () => import('#domains/auth/controllers/update_password_controller');

// Invitation
const CreateInvitationController = () => import('#domains/invitation/controllers/create_invitation_controller');
const AcceptInvitationController = () => import('#domains/invitation/controllers/accept_invitation_controller');

router.group(() => {
	router.post('/auth/login', [LoginController]).as('auth.login');
	router.post('/auth/forgot-password', [ForgotPasswordController]).as('auth.forgot_password');
	router.get('/auth/reset-password/:token', [ValidateResetPasswordRequestController]).as('auth.validate_reset_password_request');
	router.post('/auth/reset-password/:token', [ResetPasswordController]).as('auth.reset_password');
	router.post('/invite/:uuid', [AcceptInvitationController]).where('uid', uidMatcher).as('invite.accept');
});

router
	.group(() => {
		router.post('/auth/logout', [LogoutController]).as('auth.logout');
		router.get('/auth/check', [CheckLoginController]).as('auth.check');
		router.patch('/auth/password', [UpdatePasswordController]).as('auth.update_password');

		router.post('/invite', [CreateInvitationController]).as('invite.create');
	})
	.middleware(middleware.auth());
