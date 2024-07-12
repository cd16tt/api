import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const AttachmentsSchema = {
	$tableName: 'attachments',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('friendly_name', 'varchar', (col) => col.notNull())
				.addColumn('filename', 'varchar', (col) => col.notNull())
				.addColumn('path', 'varchar', (col) => col.notNull())
				.addColumn('size', 'integer', (col) => col.notNull())
				.addColumn('mime_type', 'varchar', (col) => col.notNull())
				.addColumn('alt', 'varchar', (col) => col.defaultTo(null))
				.addColumn('legend', 'varchar', (col) => col.defaultTo(null))
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))
				// Relationships
				.addForeignKeyConstraint('created_by_id', ['created_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				.addForeignKeyConstraint('updated_by_id', ['updated_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
