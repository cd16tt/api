import { Kysely } from 'kysely';

import { AddressesSchema } from '#database/schemas/addresses';
import { AttachmentsSchema } from '#database/schemas/attachments';
import { ClubContactsSchema } from '#database/schemas/club_contacts';
import { ClubSeasonsSchema } from '#database/schemas/club_seasons';
import { ClubSocialsSchema } from '#database/schemas/club_socials';
import { ClubsSchema } from '#database/schemas/clubs';
import { ClubsLicenseesSchema } from '#database/schemas/clubs_licensees';
import { GradesSchema } from '#database/schemas/grades';
import { GradesLicenseesSchema } from '#database/schemas/grades_licensees';
import { HallsSchema } from '#database/schemas/halls';
import { InvitationsSchema } from '#database/schemas/invitations';
import { LicenseesSchema } from '#database/schemas/licensees';
import { PositionTitlesSchema } from '#database/schemas/position_titles';
import { RememberMeTokensSchema } from '#database/schemas/remember_me_tokens';
import { SeasonsSchema } from '#database/schemas/seasons';
import { UsersSchema } from '#database/schemas/users';
import { DB } from '#types/db';

export async function up(db: Kysely<DB>): Promise<void> {
	await UsersSchema.create(db);
	await SeasonsSchema.create(db);
	await RememberMeTokensSchema.create(db);
	await ClubsSchema.create(db);
	await ClubSeasonsSchema.create(db);
	await LicenseesSchema.create(db);
	await InvitationsSchema.create(db);
	await GradesSchema.create(db);
	await GradesLicenseesSchema.create(db);
	await ClubsLicenseesSchema.create(db);
	await ClubSocialsSchema.create(db);
	await AddressesSchema.create(db);
	await HallsSchema.create(db);
	await PositionTitlesSchema.create(db);
	await ClubContactsSchema.create(db);
	await AttachmentsSchema.create(db);

	await UsersSchema.alter(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
	await UsersSchema.dropAlter(db);

	await AttachmentsSchema.drop(db);
	await ClubContactsSchema.drop(db);
	await PositionTitlesSchema.drop(db);
	await HallsSchema.drop(db);
	await AddressesSchema.drop(db);
	await ClubSocialsSchema.drop(db);
	await ClubsLicenseesSchema.drop(db);
	await GradesLicenseesSchema.drop(db);
	await GradesSchema.drop(db);
	await InvitationsSchema.drop(db);
	await LicenseesSchema.drop(db);
	await ClubSeasonsSchema.drop(db);
	await ClubsSchema.drop(db);
	await RememberMeTokensSchema.drop(db);
	await SeasonsSchema.drop(db);
	await UsersSchema.drop(db);
}
