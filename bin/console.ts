import 'reflect-metadata';
import { Ignitor, prettyPrintError } from '@adonisjs/core';

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
		app.listen('SIGTERM', () => {
			void app.terminate();
		});
		app.listenIf(app.managedByPm2, 'SIGINT', () => {
			void app.terminate();
		});
	})
	.ace()
	.handle(process.argv.splice(2))
	// eslint-disable-next-line unicorn/prefer-top-level-await
	.catch((error) => {
		process.exitCode = 1;
		void prettyPrintError(error);
	});
