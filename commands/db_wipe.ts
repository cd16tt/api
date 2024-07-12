import { inject } from '@adonisjs/core';
import { BaseCommand, flags } from '@adonisjs/core/ace';
import { CommandOptions } from '@adonisjs/core/types/ace';

import { Database } from '#shared/services/database';

export default class DatabaseWipe extends BaseCommand {
	static override commandName = 'db:wipe';
	static override description = 'Drop all tables, views and types in database';
	static override options: CommandOptions = {
		startApp: true,
	};

	/**
	 * Drop all views in database
	 */
	@flags.boolean({ description: 'Drop all views' })
	declare dropViews: boolean;

	/**
	 * Drop all types in database
	 */
	@flags.boolean({ description: 'Drop all custom types (Postgres only)' })
	declare dropTypes: boolean;

	/**
	 * Drop all domains in database
	 */
	@flags.boolean({ description: 'Drop all domains (Postgres only)' })
	declare dropDomains: boolean;

	/**
	 * Force command execution in production
	 */
	@flags.boolean({ description: 'Explicitly force command to run in production' })
	declare force: boolean;

	@inject()
	override async run(database: Database): Promise<void> {
		await (this.isMain ? this.runAsMain(database) : this.runAsSubCommand(database));
	}

	@inject()
	override async completed(database: Database) {
		if (this.isMain) {
			await database.client.destroy();
		}
	}

	/**
	 * Prompts to take consent when wiping the database in production
	 */
	private async takeProductionConsent(): Promise<boolean> {
		const question = 'You are in production environment. Want to continue wiping the database?';
		try {
			return await this.prompt.confirm(question);
		} catch {
			return false;
		}
	}

	/**
	 * Drop all views (if asked for and supported)
	 */
	private async performDropViews(database: Database) {
		if (!this.dropViews) {
			return;
		}

		await database.dropAllViews();
		this.logger.success('Dropped views successfully');
	}

	/**
	 * Drop all tables
	 */
	private async performDropTables(database: Database) {
		await database.dropAllTables();
		this.logger.success('Dropped tables successfully');
	}

	/**
	 * Drop all types (if asked for and supported)
	 */
	private async performDropTypes(database: Database) {
		if (!this.dropTypes) {
			return;
		}

		await database.dropAllTypes();
		this.logger.success('Dropped types successfully');
	}

	/**
	 * Drop all domains (if asked for and supported)
	 */
	private async performDropDomains(database: Database) {
		if (!this.dropDomains) {
			return;
		}

		await database.dropAllDomains();
		this.logger.success('Dropped domains successfully');
	}

	/**
	 * Run as a subcommand. Never close database connections or exit
	 * process inside this method
	 */
	private async runAsSubCommand(database: Database) {
		/**
		 * Continue with clearing the database when not in production
		 * or force flag is passed
		 */
		let continueWipe = !this.app.inProduction || this.force;
		if (!continueWipe) {
			continueWipe = await this.takeProductionConsent();
		}

		/**
		 * Do not continue when in prod and the prompt was cancelled
		 */
		if (!continueWipe) {
			return;
		}

		await this.performDropViews(database);
		await this.performDropTables(database);
		await this.performDropTypes(database);
		await this.performDropDomains(database);
	}

	/**
	 * Branching out, so that if required we can implement
	 * "runAsMain" separately from "runAsSubCommand".
	 *
	 * For now, they both are the same
	 */
	private async runAsMain(database: Database) {
		await this.runAsSubCommand(database);
	}
}
