import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const LicenseesSchema = {
	$tableName: 'licensees',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('code', 'varchar', (col) => col.notNull())
				.addColumn('firstname', 'varchar', (col) => col.notNull())
				.addColumn('lastname', 'varchar', (col) => col.notNull())
				.addColumn('gender', 'char(1)', (col) => col.notNull())
				.addColumn('email', 'varchar', (col) => col.defaultTo(null))
				.addColumn('phone', 'char(10)', (col) => col.defaultTo(null))
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
				.addUniqueConstraint(`${this.$tableName}_code_unique`, ['code'])
				.addUniqueConstraint(`${this.$tableName}_code_email_unique`, ['code', 'email'])
				.addUniqueConstraint(`${this.$tableName}_code_phone_unique`, ['code', 'phone'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
