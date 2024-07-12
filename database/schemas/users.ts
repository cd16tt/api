import { Kysely, sql } from 'kysely';

import { DB } from '#types/db';

export const UsersSchema = {
	$tableName: 'users',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('username', 'varchar', (col) => col.notNull())
				.addColumn('password', 'varchar', (col) => col.notNull())
				.addColumn('permissions', sql`varchar[]`, (col) => col.notNull().defaultTo(sql`'{}'`))
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_username_unique`, ['username'])
				// Build query
				.execute()
		);
	},
	alter({ schema }: Kysely<DB>) {
		return (
			schema
				.alterTable(this.$tableName)
				// Columns
				.addColumn('licensee_id', 'integer', (col) => col.notNull().references('licensees.id').onDelete('cascade'))
				.addColumn('created_by_id', 'integer', (col) => col.references('users.id').onDelete('set null').defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.references('users.id').onDelete('set null').defaultTo(null))
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
	dropAlter({ schema }: Kysely<DB>) {
		return schema
			.alterTable(this.$tableName)
			.dropColumn('licensee_id')
			.dropColumn('created_by_id')
			.dropColumn('updated_by_id')
			.execute();
	},
};
