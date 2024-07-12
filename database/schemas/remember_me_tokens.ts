import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const RememberMeTokensSchema = {
	$tableName: 'remember_me_tokens',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('tokenable_id', 'integer', (col) => col.notNull())
				.addColumn('hash', 'varchar', (col) => col.notNull())
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('expires_at', 'timestamp', (col) => col.notNull())
				// Relationships
				.addForeignKeyConstraint('user_id', ['tokenable_id'], 'users', ['id'], (cb) => cb.onDelete('cascade'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_user_id_unique`, ['tokenable_id'])
				.addUniqueConstraint(`${this.$tableName}_hash_unique`, ['hash'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
