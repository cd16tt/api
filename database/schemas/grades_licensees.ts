import { Kysely } from 'kysely';

import { DB } from '#types/db';

export const GradesLicenseesSchema = {
	$tableName: 'grades_licensees',
	create({ schema }: Kysely<DB>) {
		return (
			schema
				.createTable(this.$tableName)
				// Columns
				.addColumn('id', 'serial', (col) => col.notNull())
				.addColumn('uid', 'char(20)', (col) => col.notNull())
				.addColumn('grade_id', 'integer', (col) => col.notNull())
				.addColumn('licensee_id', 'integer', (col) => col.notNull())
				.addColumn('obtained_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_at', 'timestamp', (col) => col.notNull())
				.addColumn('updated_at', 'timestamp', (col) => col.notNull())
				.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
				.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))
				// Relationships
				.addForeignKeyConstraint('grade_id', ['grade_id'], 'grades', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('licensee_id', ['licensee_id'], 'licensees', ['id'], (cb) => cb.onDelete('cascade'))
				.addForeignKeyConstraint('created_by_id', ['created_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				.addForeignKeyConstraint('updated_by_id', ['updated_by_id'], 'users', ['id'], (cb) => cb.onDelete('set null'))
				// Indices
				.addPrimaryKeyConstraint(`${this.$tableName}_pkey`, ['id'])
				.addUniqueConstraint(`${this.$tableName}_uid_unique`, ['uid'])
				.addUniqueConstraint(`${this.$tableName}_grade_licensee_unique`, ['grade_id', 'licensee_id'])
				// Build query
				.execute()
		);
	},
	drop({ schema }: Kysely<DB>) {
		return schema.dropTable(this.$tableName).execute();
	},
};
