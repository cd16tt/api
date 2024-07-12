import type { CommandOptions } from '@adonisjs/core/types/ace';

import { inject } from '@adonisjs/core';
import { BaseCommand } from '@adonisjs/core/ace';

import { SeasonSeeder } from '#database/seeders/season_seeder';
import { UserSeeder } from '#database/seeders/user_seeder';
import { Database } from '#shared/services/database';
import SmartpingJsonImporterService from '#shared/services/smartping_json_importer';

export default class DatabaseSeed extends BaseCommand {
	static override commandName = 'db:seed';
	static override description = 'Seed database with fake data';
	static override options: CommandOptions = {
		startApp: true,
	};

	@inject()
	override async completed(database: Database) {
		if (this.isMain) {
			await database.client.destroy();
		}
	}

	override async run() {
		this.logger.info(`Seeding in process...`);

		const season = await SeasonSeeder.run(this.app);

		if (!season) {
			this.logger.error('Impossible de créer la saison.');
			return void 1;
		}

		const smartpingImporterService = new SmartpingJsonImporterService();
		await smartpingImporterService.import(season.id);

		await UserSeeder.run(this.app);
	}
}
