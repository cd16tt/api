import type { CommandOptions } from '@adonisjs/core/types/ace';

import { inject } from '@adonisjs/core';
import { BaseCommand } from '@adonisjs/core/ace';
import { sql } from 'kysely';

import { Database } from '#shared/services/database';

export default class DatabaseSeed extends BaseCommand {
	static override commandName = 'db:truncate';
	static override description = 'Reset all database tables';
	static override options: CommandOptions = {
		startApp: true,
	};

	@inject()
	override async completed(database: Database) {
		await database.client.destroy();
	}

	@inject()
	override async run(database: Database) {
		const queryResult = await sql<{ tableName: string }>`SELECT table_name
																												 FROM information_schema.tables
																												 WHERE table_schema = 'public'
																													 AND table_type = 'BASE TABLE';`.execute(database.client);

		for (const { tableName } of queryResult.rows) {
			await sql`TRUNCATE ${sql.table(tableName)} RESTART IDENTITY CASCADE`.execute(database.client);
			this.logger.info(`Table ${tableName} truncated`);
		}

		this.logger.success('All tables truncated successfully');
	}
}
