import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const HallsSchema = {
	$tableName: 'halls',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('name', 'varchar', (col) => col.notNull())
				.addColumn('club_season_id', 'integer', (col) => col.notNull())
				.addColumn('address_id', 'integer', (col) => col.notNull())
				.addColumn('is_default_choice', 'boolean', (col) => col.notNull().defaultTo(false))
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))
				// Relationships
				.addForeignKeyConstraint('club_season_id', ['club_season_id'], 'clubs_seasons', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('address_id', ['address_id'], 'addresses', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('created_by_id', ['created_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				.addForeignKeyConstraint('updated_by_id', ['updated_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_club_season_address_unique`, ['club_season_id', 'address_id'])
				.addUniqueConstraint(`${this.$tableName}_club_season_default_choice_unique`, ['club_season_id', 'is_default_choice'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
