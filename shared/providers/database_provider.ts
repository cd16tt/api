import type { ApplicationService } from '@adonisjs/core/types';
import type { FieldContext } from '@vinejs/vine/types';

import { Kysely } from 'kysely';

import { Database } from '#shared/services/database';
import { DatabaseTestUtils } from '#tests/utils/database';
import type { DB } from '#types/db';

declare module '@adonisjs/core/types' {
	export interface ContainerBindings {
		db: Database;
	}
}

declare module '@adonisjs/core/test_utils' {
	export interface TestUtils {
		db(): DatabaseTestUtils;
	}
}

/**
 * Extending VineJS schema types
 */
declare module '@vinejs/vine' {
	interface VineKyselyBindings<ValueType extends string | number> {
		/**
		 * Ensure the value is unique inside the database by self
		 * executing a query.
		 *
		 * - The callback must return "true", if the value is unique (does not exist).
		 * - The callback must return "false", if the value is not unique (already exists).
		 */
		unique(callback: (db: Kysely<DB>, value: ValueType, field: FieldContext) => Promise<boolean>): this;

		/**
		 * Ensure the value exists inside the database by self
		 * executing a query.
		 *
		 * - The callback must return "false", if the value exists.
		 * - The callback must return "true", if the value does not exist.
		 */
		exists(callback: (db: Kysely<DB>, value: ValueType, field: FieldContext) => Promise<boolean>): this;
	}

	interface VineNumber extends VineKyselyBindings<number> {}

	interface VineString extends VineKyselyBindings<string> {}
}

/**
 * Database service provider
 */
export default class DatabaseServiceProvider {
	constructor(protected app: ApplicationService) {}

	/**
	 * Invoked by AdonisJS to register container bindings
	 */
	register() {
		this.app.container.singleton('db', () => new Database());
	}

	/**
	 * Invoked by AdonisJS to extend the framework or pre-configure
	 * objects
	 */
	async boot() {
		const db = await this.app.container.make('db');

		this.registerTestUtils();
		await this.registerVineJSRules(db.client);
	}

	/**
	 * Gracefully close connections during shutdown
	 */
	async shutdown() {
		const db = await this.app.container.make('db');
		await db.client.destroy();
	}

	/**
	 * Registers validation rules for VineJS
	 */
	protected async registerVineJSRules(db: Kysely<DB>) {
		if (this.app.usingVineJS) {
			const { defineValidationRules } = await import('#shared/validators/database_bindings');
			defineValidationRules(db);
		}
	}

	/**
	 * Register TestUtils database macro
	 */
	protected registerTestUtils() {
		this.app.container.resolving('testUtils', async () => {
			const { TestUtils } = await import('@adonisjs/core/test_utils');

			TestUtils.macro('db', () => {
				return new DatabaseTestUtils(this.app);
			});
		});
	}
}
