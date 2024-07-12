import type { CommandOptions } from '@adonisjs/core/types/ace';

import fs from 'node:fs/promises';
import path from 'node:path';

import { inject } from '@adonisjs/core';
import { BaseCommand } from '@adonisjs/core/ace';
import { FileMigrationProvider, Migrator } from 'kysely';

import { Database } from '#shared/services/database';

export default class KyselyRollback extends BaseCommand {
	static override commandName = 'kysely:rollback';
	static override description = 'Rollback the database by running down method on the migration files';
	static override options: CommandOptions = {
		startApp: true,
	};

	declare migrator: Migrator;

	@inject()
	override prepare(database: Database) {
		this.migrator = new Migrator({
			db: database.client,
			provider: new FileMigrationProvider({
				fs,
				path,
				migrationFolder: this.app.migrationsPath(),
			}),
		});
	}

	@inject()
	override async completed(database: Database) {
		await database.client.destroy();
	}

	override async run() {
		const { error, results } = await this.migrator.migrateDown();

		if (results)
			for (const it of results) {
				switch (it.status) {
					case 'Success': {
						this.logger.success(`migration "${it.migrationName}" rolled back successfully`);
						break;
					}
					case 'Error': {
						this.logger.error(`failed to rollback migration "${it.migrationName}"`);
						break;
					}
					case 'NotExecuted': {
						this.logger.info(`rollback pending "${it.migrationName}"`);
					}
				}
			}

		if (error) {
			this.logger.error('Failed to rollback');
			this.error = error;
			this.exitCode = 1;
		}
	}
}
