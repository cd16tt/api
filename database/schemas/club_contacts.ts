import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const ClubContactsSchema = {
	$tableName: 'club_contacts',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('club_season_id', 'integer', (col) => col.notNull())
				.addColumn('licensee_id', 'integer', (col) => col.notNull())
				.addColumn('position_title_id', 'integer', (col) => col.notNull())
				.addColumn('email', 'varchar', (col) => col.defaultTo(null))
				.addColumn('phone', 'char(10)', (col) => col.defaultTo(null))
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))
				// Relationships
				.addForeignKeyConstraint('club_season_id', ['club_season_id'], 'clubs_seasons', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('licensee_id', ['licensee_id'], 'licensees', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('position_title_id', ['position_title_id'], 'position_titles', ['id'], (cb) =>
					cb.onDelete('cascade'),
				)
				.addForeignKeyConstraint('created_by_id', ['created_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				.addForeignKeyConstraint('updated_by_id', ['updated_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_club_season_id_licensee_id_position_title_id`, [
					'club_season_id',
					'licensee_id',
					'position_title_id',
				])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};