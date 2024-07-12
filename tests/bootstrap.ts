import type { Config } from '@japa/runner/types';

import { authApiClient } from '@adonisjs/auth/plugins/api_client';
import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { sessionApiClient } from '@adonisjs/session/plugins/api_client';
import { apiClient } from '@japa/api-client';
import { assert } from '@japa/assert';
import { expectTypeOf } from '@japa/expect-type';
import { fileSystem } from '@japa/file-system';
import { pluginAdonisJS } from '@japa/plugin-adonisjs';
import { snapshot } from '@japa/snapshot';

export const plugins: Config['plugins'] = [
	assert(),
	snapshot(),
	fileSystem(),
	expectTypeOf(),
	apiClient({ baseURL: 'http://0.0.0.0:3333' }),
	pluginAdonisJS(app),
	sessionApiClient(app),
	authApiClient(app),
];

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
	setup: [() => testUtils.db().wipe(), () => testUtils.db().migrate(), () => testUtils.db().seed()],
	teardown: [],
};

export const configureSuite: Config['configureSuite'] = (suite) => {
	if (['functional', 'e2e'].includes(suite.name)) {
		return suite.setup(() => testUtils.httpServer().start());
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return suite.setup(() => {});
};
