process.env['NODE_ENV'] = 'test';

import 'reflect-metadata';
import { Ignitor, prettyPrintError } from '@adonisjs/core';
import { configure, processCLIArgs, run } from '@japa/runner';

const APP_ROOT = new URL('../', import.meta.url);

const IMPORTER = (filePath: string) => {
	if (filePath.startsWith('./') || filePath.startsWith('../')) {
		return import(new URL(filePath, APP_ROOT).href);
	}
	return import(filePath);
};

new Ignitor(APP_ROOT, { importer: IMPORTER })
	.tap((app) => {
		app.booting(async () => {
			await import('#start/env');
		});
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		app.listen('SIGTERM', () => app.terminate());
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate());
	})
	.testRunner()
	.configure(async (app) => {
		const { runnerHooks, ...config } = await import('../tests/bootstrap.js');

		processCLIArgs(process.argv.splice(2));
		configure({
			...app.rcFile.tests,
			...config,
			setup: runnerHooks.setup,
			teardown: [...runnerHooks.teardown, () => app.terminate()],
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			configureSuite: config.configureSuite ?? (() => {}),
			plugins: config.plugins ?? [],
		});
	})
	.run(() => run())
	// eslint-disable-next-line unicorn/prefer-top-level-await
	.catch((error) => {
		process.exitCode = 1;
		void prettyPrintError(error);
	});
