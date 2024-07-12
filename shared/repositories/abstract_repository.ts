import type {
	InsertQueryBuilder,
	OperandValueExpression,
	ReferenceExpression,
	SelectExpression,
	Transaction,
	UpdateObject,
} from 'kysely';

import { inject } from '@adonisjs/core';

import { Database } from '#shared/services/database';
import { DB } from '#types/db';

export type ExtractTableAlias<DB, TE> = TE extends `${string} as ${infer TA}`
	? TA extends keyof DB
		? TA
		: never
	: TE extends keyof DB
		? TE
		: never;

export type UpdateObjectExpression<DB, TB extends keyof DB, UT extends keyof DB = TB> = UpdateObject<DB, TB, UT>;

// Commons to all actions
export type Table = keyof DB;

// Select
export type SelectColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
export type SelectValue<T extends Table, C extends SelectColumn<T>> = OperandValueExpression<DB, ExtractTableAlias<DB, T>, C>;
export type SelectReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;

// Insert
export type InsertPayload<T extends Table> = Parameters<InsertQueryBuilder<DB, T, NonNullable<unknown>>['values']>[0];
export type InsertReturn<T extends Table> = SelectExpression<DB, T>;

// Update
export type UpdatePayload<T extends Table> = UpdateObjectExpression<DB, ExtractTableAlias<DB, T>>;
export type UpdateColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
export type UpdateValue<T extends Table, C extends UpdateColumn<T>> = OperandValueExpression<DB, ExtractTableAlias<DB, T>, C>;
export type UpdateReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;

// Delete
export type DeleteColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
export type DeleteValue<T extends Table, C extends DeleteColumn<T>> = OperandValueExpression<DB, ExtractTableAlias<DB, T>, C>;
export type DeleteReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;

@inject()
export default abstract class AbstractRepository {
	constructor(protected readonly db: Database) {}

	protected $findAll<T extends Table>({ table, transaction }: { table: T; transaction?: Transaction<DB> | undefined }) {
		const query = (transaction ?? this.db.client).selectFrom(table);

		return {
			selectAll: () => query.selectAll().execute(),
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) => query.select(selection).execute(),
			selectAllTakeFirst: () => query.selectAll().executeTakeFirst(),
			selectTakeFirst: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) => query.select(selection).executeTakeFirst(),
		};
	}

	protected $findBy<T extends Table, C extends SelectColumn<T>>({
		where,
		table,
		transaction,
	}: {
		table: T;
		where: ReadonlyArray<[C, SelectValue<T, C>]>;
		transaction?: Transaction<DB> | undefined;
	}) {
		let query = (transaction ?? this.db.client).selectFrom(table);

		for (const [column, value] of where) {
			query = query.where(column, '=', value);
		}

		return {
			selectAll: () => query.selectAll().execute(),
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) => query.select(selection).execute(),
			selectAllTakeFirst: () => query.selectAll().executeTakeFirst(),
			selectTakeFirst: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) => query.select(selection).executeTakeFirst(),
		};
	}

	protected $create<T extends Table>({
		payload,
		table,
		transaction,
	}: {
		table: T;
		payload: InsertPayload<T>;
		transaction?: Transaction<DB> | undefined;
	}) {
		const query = (transaction ?? this.db.client).insertInto(table).values(payload);

		return {
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returning: <S extends InsertReturn<T>>(...selection: ReadonlyArray<S>) => query.returning(selection).executeTakeFirst(),
			returningOrThrow: <S extends InsertReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}

	protected $update<T extends Table, C extends UpdateColumn<T>>({
		where,
		payload,
		table,
		transaction,
	}: {
		table: T;
		where: ReadonlyArray<[C, UpdateValue<T, C>]>;
		payload: UpdatePayload<T>;
		transaction?: Transaction<DB> | undefined;
	}) {
		let query = (transaction ?? this.db.client).updateTable(table).set(payload);

		for (const [column, value] of where) {
			query = query.where(column, '=', value);
		}

		return {
			execute: () => query.execute(),
			executeTakeFirst: () => query.executeTakeFirst(),
			executeTakeFirstOrThrow: () => query.executeTakeFirstOrThrow(),
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returning: <S extends UpdateReturn<T>>(...selection: ReadonlyArray<S>) => query.returning(selection).executeTakeFirst(),
			returningOrThrow: <S extends UpdateReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}

	protected $delete<T extends Table, C extends DeleteColumn<T>>({
		where,
		table,
		transaction,
	}: {
		table: T;
		where: ReadonlyArray<[C, DeleteValue<T, C>]>;
		transaction?: Transaction<DB> | undefined;
	}) {
		let query = (transaction ?? this.db.client).deleteFrom(table);

		for (const [column, value] of where) {
			query = query.where(column, '=', value);
		}

		return {
			execute: () => query.execute(),
			executeTakeFirst: () => query.executeTakeFirst(),
			executeTakeFirstOrThrow: () => query.executeTakeFirstOrThrow(),
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returning: <S extends DeleteReturn<T>>(...selection: ReadonlyArray<S>) => query.returning(selection).executeTakeFirst(),
			returningOrThrow: <S extends DeleteReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}
}
