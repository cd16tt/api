import { ApplicationService } from '@adonisjs/core/types';

import UserRepository from '#domains/auth/repositories/user_repository';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';

export const UserSeeder = {
	async run(app: ApplicationService): Promise<void> {
		const userRepository = await app.container.make(UserRepository);
		const licenseeRepository = await app.container.make(LicenseeRepository);

		const adminLicensee = await licenseeRepository.findBy([['code', '1610533']]).selectTakeFirst('id');

		if (!adminLicensee) {
			throw new Error('Admin licensee not found');
		}

		const user = await userRepository.create({
			licenseeId: adminLicensee.id,
			password: 'password',
			permissions: ['*'],
			username: 'user_admin',
		});

		await user.returning('id');
	},
};
