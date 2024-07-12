import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';

import env from '#start/env';
import type { DB } from '#types/db';

const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			host: env.get('POSTGRES_HOST'),
			port: env.get('POSTGRES_PORT'),
			user: env.get('POSTGRES_USER'),
			password: env.get('POSTGRES_PASSWORD'),
			database: env.get('POSTGRES_DB'),
			max: 10,
		}),
	}),
	plugins: [new CamelCasePlugin()],
});

export class Database {
	readonly #db: Kysely<DB>;

	constructor() {
		this.#db = db;
	}

	get client() {
		return this.#db;
	}

	async getAllTables() {
		const { rows } = await sql
			.raw<{
				tableName: string;
			}>(
				`SELECT tablename AS table_name
				 FROM pg_catalog.pg_tables
				 WHERE schemaname IN ('public')
				 ORDER BY tablename;`,
			)
			.execute(this.#db);

		return rows.map(({ tableName }) => tableName);
	}

	async getAllViews() {
		const { rows } = await sql
			.raw<{
				viewName: string;
			}>(
				`SELECT viewname AS view_name
				 FROM pg_catalog.pg_views
				 WHERE schemaname IN ('public')
				 ORDER BY viewname;`,
			)
			.execute(this.#db);

		return rows.map(({ viewName }) => viewName);
	}

	async getAllTypes() {
		const { rows } = await sql
			.raw<{
				typname: string;
			}>(
				`SELECT DISTINCT pg_type.typname
				 FROM pg_type
								INNER JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid;`,
			)
			.execute(this.#db);

		return rows.map(({ typname }) => typname);
	}

	async getAllDomains() {
		const { rows } = await sql
			.raw<{
				typname: string;
			}>(
				`SELECT DISTINCT pg_type.typname
				 FROM pg_type
								INNER JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
				 WHERE pg_type.typtype = 'd';`,
			)
			.execute(this.#db);

		return rows.map(({ typname }) => typname);
	}

	async truncate(table: string, cascade = false) {
		return cascade
			? await sql`TRUNCATE TABLE ${sql.table(table)} CASCADE;`.execute(this.#db)
			: await sql`TRUNCATE TABLE ${sql.table(table)};`.execute(this.#db);
	}

	async dropAllTables() {
		let tables = await this.getAllTables();

		/**
		 * Filter out tables that are not allowed to be dropped
		 */
		tables = tables.filter((table) => !['spatial_ref_sys'].includes(table));

		if (tables.length === 0) {
			return;
		}

		await sql.raw(`DROP TABLE "${tables.join('", "')}" CASCADE;`).execute(this.#db);
	}

	async dropAllViews() {
		const views = await this.getAllViews();
		if (views.length === 0) return;

		await sql.raw(`DROP VIEW "${views.join('", "')}" CASCADE;`).execute(this.#db);
	}

	async dropAllTypes() {
		const types = await this.getAllTypes();
		if (types.length === 0) return;

		await sql.raw(`DROP TYPE "${types.join('", "')}" CASCADE;`).execute(this.#db);
	}

	async dropAllDomains() {
		const domains = await this.getAllDomains();
		if (domains.length === 0) return;

		// Don't drop built-in domains
		// https://www.postgresql.org/docs/current/infoschema-datatypes.html
		const builtInDomains = new Set(['cardinal_number', 'character_data', 'sql_identifier', 'time_stamp', 'yes_or_no']);

		const domainsToDrop = domains.filter((domain) => !builtInDomains.has(domain));

		await sql.raw(`DROP DOMAIN "${domainsToDrop.join('", "')}" CASCADE;`).execute(this.#db);
	}

	async getAdvisoryLock(key: string): Promise<boolean> {
		const { rows } = await sql
			.raw<{ lock_status: boolean }>(`SELECT PG_TRY_ADVISORY_LOCK('${key}') as lock_status;`)
			.execute(this.#db);

		return rows[0]?.lock_status === true;
	}

	async releaseAdvisoryLock(key: string): Promise<boolean> {
		const { rows } = await sql
			.raw<{ lock_status: boolean }>(`SELECT PG_ADVISORY_UNLOCK('${key}') as lock_status;`)
			.execute(this.#db);

		return rows[0]?.lock_status === true;
	}
}
