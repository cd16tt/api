/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DateTime } from 'luxon';

import { OperandValueExpressionOrList, ReferenceExpression, SelectExpression } from 'kysely';

import { DB } from './db.ts';

// Matches any primitive value.
export type Primitive = null | string | number | boolean | DateTime;

// Get all values of an object as a union type.
export type ValueOf<T> = T[keyof T];

// Get all values of an object as a union type, including nested objects.
export type DeepValueOf<T extends Record<string, unknown>, Key = keyof T> = Key extends string
	? T[Key] extends Record<string, unknown>
		? DeepValueOf<T[Key]>
		: ValueOf<T>
	: never;

// NullableObject<T> is an object with the same keys as T, but with all values being nullable.
export type NullableObject<T> = {
	[K in keyof T]: T[K] | null;
};

// Extract the instance type of class or the prototype of a class-like object.
export type ExtractInstanceType<T> = T extends new (...args: Array<any>) => infer R
	? R
	: T extends { prototype: infer P }
		? P
		: any;

// Get all method names of a class as a union type.
export type ExtractMethodNames<T> = {
	[K in keyof T]: T[K] extends (...args: Array<any>) => any ? K : never;
}[keyof T];

// Get all methods signatures of a class as a union type.
export type ExtractMethods<T> = Pick<T, ExtractMethodNames<T>>;

// Get all property names of a class as a union type, except those with keys starting with a $ sign prefix.
export type ExtractProperties<T> = {
	[K in keyof T]: K extends string ? (K extends `$${string}` ? never : T[K] extends Primitive ? K : never) : never;
}[keyof T];

export type TupleOf<T, N extends number> = N extends N ? (number extends N ? Array<T> : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends Array<unknown>> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type CommonFields = 'id' | 'uid' | 'createdAt' | 'updatedAt';

// Repository utils
export type RepositorySelection<Table extends keyof DB> = Array<SelectExpression<DB, Table>> | '*';
export type RepositoryColumn<Table extends keyof DB> = ReferenceExpression<DB, Table>;
export type RepositoryValue<Table extends keyof DB, Col extends RepositoryColumn<Table>> = OperandValueExpressionOrList<
	DB,
	Table,
	Col
>;

/* eslint-enable @typescript-eslint/no-explicit-any */
