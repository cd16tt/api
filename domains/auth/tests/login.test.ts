import { test } from '@japa/runner';

test.group('User login', () => {
	test('it should login an existing user', async ({ assert, client }) => {
		const response = await client.post('/auth/login').json({
			username: 'user_admin',
			password: 'password',
		});

		response.assertStatus(200);

		assert.isObject(response.body());
		assert.property(response.body(), 'uid');
	});
});
