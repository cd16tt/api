import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const AddressesSchema = {
	$tableName: 'addresses',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('address_line1', 'varchar', (col) => col.notNull())
				.addColumn('address_line2', 'varchar', (col) => col.defaultTo(null))
				.addColumn('address_line3', 'varchar', (col) => col.defaultTo(null))
				.addColumn('postal_code', 'char(5)', (col) => col.notNull())
				.addColumn('city', 'varchar', (col) => col.notNull())
				.addColumn('latitude', 'decimal(8, 5)', (col) => col.defaultTo(null))
				.addColumn('longitude', 'decimal(8, 5)', (col) => col.defaultTo(null))
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
