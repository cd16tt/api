import type { CommandOptions } from '@adonisjs/core/types/ace';

import fs from 'node:fs/promises';
import path from 'node:path';

import { inject } from '@adonisjs/core';
import { BaseCommand } from '@adonisjs/core/ace';
import { FileMigrationProvider, Migrator } from 'kysely';

import { Database } from '#shared/services/database';

export default class KyselyMigrate extends BaseCommand {
	static override commandName = 'kysely:migrate';
	static override description = 'Migrate the database by executing pending migrations';
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
		if (this.isMain) {
			await database.client.destroy();
		}
	}

	override async run() {
		const { error, results } = await this.migrator.migrateToLatest();

		if (results)
			for (const it of results) {
				switch (it.status) {
					case 'Success': {
						this.logger.success(`migration "${it.migrationName}" was executed successfully`);
						break;
					}
					case 'Error': {
						this.logger.error(`failed to execute migration "${it.migrationName}"`);
						break;
					}
					case 'NotExecuted': {
						this.logger.info(`migration pending "${it.migrationName}"`);
					}
				}
			}

		if (error) {
			this.logger.error('Failed to migrate');
			this.error = error;
			this.exitCode = 1;
		}
	}
}
