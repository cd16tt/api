import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const ClubSeasonsSchema = {
	$tableName: 'clubs_seasons',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('club_id', 'integer', (col) => col.notNull())
				.addColumn('season_id', 'integer', (col) => col.notNull())
				.addColumn('name', 'varchar', (col) => col.notNull())
				.addColumn('validated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))
				// Relationships
				.addForeignKeyConstraint('club_id', ['club_id'], 'clubs', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('season_id', ['season_id'], 'seasons', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('created_by_id', ['created_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				.addForeignKeyConstraint('updated_by_id', ['updated_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_club_id_season_id`, ['club_id', 'season_id'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
