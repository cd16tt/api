import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

import type { Permission } from '#domains/auth/value_objects/security';
import type { Uid } from '#shared/services/uid_generator';

export type Generated<T> =
	T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, string, string>;

export declare namespace Address {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		addressLine1: string;
		addressLine2: Generated<string | null>;
		addressLine3: Generated<string | null>;
		city: string;
		postalCode: string;
		latitude: Generated<string | null>;
		longitude: Generated<string | null>;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Attachment {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		filename: string;
		friendlyName: string;
		alt: Generated<string | null>;
		legend: Generated<string | null>;
		mimeType: string;
		path: string;
		size: number;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace ClubContact {
	export interface Table {
		uid: Uid;
		id: Generated<number>;
		email: Generated<string | null>;
		phone: Generated<string | null>;
		clubSeasonId: number;
		licenseeId: number;
		positionTitleId: number;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Club {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		code: string;
		federationId: string;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace ClubLicensee {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		clubSeasonId: number;
		licenseeId: number;
		transferredAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace ClubSocial {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		clubSeasonId: number;
		name: string;
		uri: string;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace ClubSeason {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		clubId: number;
		seasonId: number;
		name: string;
		validatedAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Grade {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		name: string;
		recyclingDelay: Generated<number | null>;
		typology: number;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace GradeLicensee {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		gradeId: number;
		licenseeId: number;
		obtainedAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Hall {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		name: string;
		addressId: number;
		clubSeasonId: number;
		isDefaultChoice: Generated<boolean>;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Invitation {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		licenseeId: number;
		permissions: Generated<Array<Permission>>;
		expiresAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Licensee {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		code: string;
		firstname: string;
		lastname: string;
		gender: string;
		email: Generated<string | null>;
		phone: Generated<string | null>;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace PositionTitle {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		name: string;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace RememberMeToken {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		hash: string;
		tokenableId: number;
		expiresAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Season {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		startDate: Timestamp;
		endDate: Timestamp;
		isCurrent: Generated<boolean>;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace User {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		username: string;
		password: string;
		permissions: Generated<Array<Permission>>;
		licenseeId: number;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export interface DB {
	addresses: Address.Table;
	attachments: Attachment.Table;
	club_contacts: ClubContact.Table;
	club_socials: ClubSocial.Table;
	clubs: Club.Table;
	clubs_licensees: ClubLicensee.Table;
	clubs_seasons: ClubSeason.Table;
	grades: Grade.Table;
	grades_licensees: GradeLicensee.Table;
	halls: Hall.Table;
	invitations: Invitation.Table;
	licensees: Licensee.Table;
	position_titles: PositionTitle.Table;
	remember_me_tokens: RememberMeToken.Table;
	seasons: Season.Table;
	users: User.Table;
}
