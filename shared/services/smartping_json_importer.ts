import type { SmartpingClub, SmartpingClubDetail, SmartpingPlayer } from '@smartping-api/core';

import app from '@adonisjs/core/services/app';
import { DateTime } from 'luxon';

import AddressRepository from '#domains/address/repositories/address_repository';
import ClubRepository from '#domains/club/repositories/club_repository';
import ClubSeasonRepository from '#domains/club/repositories/club_season_repository';
import ClubSocialRepository from '#domains/club/repositories/club_social_repository';
import HallRepository from '#domains/club/repositories/hall_repository';
import ClubLicenseeRepository from '#domains/licensee/repositories/club_licensee_repository';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import clubs from '#root/tmp/clubs.json' assert { type: 'json' };
import licensees from '#root/tmp/licensees.json' assert { type: 'json' };
import { date } from '#shared/services/date_factory';

type JsonClub = {
	club: ReturnType<SmartpingClub['serialize']>;
	clubDetail: ReturnType<SmartpingClubDetail['serialize']>;
};

type JsonLicensee = ReturnType<SmartpingPlayer['serialize']>;

export default class SmartpingJsonImporterService {
	async import(seasonId: number) {
		const licenseeRepository = await app.container.make(LicenseeRepository);
		const clubLicenseeRepository = await app.container.make(ClubLicenseeRepository);

		/** Création des clubs en base */
		for (const clubToSync of clubs as Array<JsonClub>) {
			const clubId = await this.#getOrCreateClub(clubToSync);

			if (!clubId) continue;

			const clubSeasonId = await this.#getOrCreateClubSeason(clubId, seasonId, clubToSync);

			if (!clubSeasonId) continue;

			await this.#createClubSocial(clubSeasonId, clubToSync.clubDetail);
			await this.#createClubAddress(clubSeasonId, clubToSync.clubDetail);

			const licenseesToSync = (licensees as unknown as Record<string, Array<JsonLicensee>>)[clubToSync.club.code]!;

			for (const licenseeToSync of licenseesToSync) {
				let licensee = await licenseeRepository.findBy([['code', licenseeToSync.licence]]).selectTakeFirst('id');

				if (!licensee) {
					licensee = await licenseeRepository
						.create({
							code: licenseeToSync.licence,
							gender: licenseeToSync.gender ?? 'M',
							firstname: licenseeToSync.firstname,
							lastname: licenseeToSync.lastname,
							email: null,
							phone: null,
						})
						.returning('id');
				}

				if (!licensee) continue;

				await clubLicenseeRepository
					.create({
						clubSeasonId: clubSeasonId,
						licenseeId: licensee.id,
						transferredAt: date().toSQL(),
					})
					.returning('id');
			}
		}
	}

	async #getOrCreateClub({ clubDetail }: JsonClub): Promise<number | undefined> {
		const clubRepository = await app.container.make(ClubRepository);

		/** Si le club n'est pas validé, on ne le prend pas en compte */
		if (!clubDetail?.validatedAt) return;

		/** Si le club n'existe pas en base, on le crée */
		const club = await clubRepository
			.create({
				code: clubDetail.code,
				federationId: clubDetail.id,
			})
			.returning('id');

		/** Si le club ne peut pas être créé, on abort early et on passe au suivant */
		if (!club) {
			throw new Error(`Impossible de créer le club ${clubDetail.code}.`);
		}

		return club.id;
	}

	async #getOrCreateClubSeason(clubId: number, seasonId: number, { club }: JsonClub) {
		const clubSeasonRepository = await app.container.make(ClubSeasonRepository);

		const newClubSeason = await clubSeasonRepository
			.create({
				clubId: clubId,
				seasonId: seasonId,
				name: club.name,
				validatedAt: club.validatedAt
					? DateTime.fromFormat('dd/LL/yyyy', club.validatedAt).toSQL() ?? date().toSQL()
					: DateTime.fromFormat('dd/LL/yyyy', '01/07/2024').toSQL() ?? date().toSQL(),
			})
			.returning('id');

		if (!newClubSeason) {
			return;
		}

		return newClubSeason.id;
	}

	async #createClubSocial(clubSeasonId: number, clubDetail: JsonClub['clubDetail']) {
		if (!clubDetail.contact.website) return;

		const clubSocialRepository = await app.container.make(ClubSocialRepository);
		await clubSocialRepository
			.create({
				name: 'Site internet',
				uri: clubDetail.contact.website,
				clubSeasonId: clubSeasonId,
			})
			.returning('id');
	}

	async #createClubAddress(clubSeasonId: number, clubDetail: JsonClub['clubDetail']) {
		const addressRepository = await app.container.make(AddressRepository);
		const hallRepository = await app.container.make(HallRepository);

		let address = await addressRepository
			.findBy([
				['addressLine1', clubDetail.hall.address1],
				['postalCode', clubDetail.hall.postalCode],
			])
			.selectTakeFirst('id');

		if (!address) {
			address = await addressRepository
				.create({
					addressLine1: clubDetail.hall.address1,
					addressLine2: clubDetail.hall.address2 ?? null,
					addressLine3: clubDetail.hall.address3 ?? null,
					city: clubDetail.hall.city,
					postalCode: clubDetail.hall.postalCode,
					latitude: null,
					longitude: null,
				})
				.returningOrThrow('id');
		}

		const hall = await hallRepository
			.findBy([
				['addressId', address.id],
				['clubSeasonId', clubSeasonId],
			])
			.selectTakeFirst('id');

		if (hall) return hall.id;

		return hallRepository
			.create({
				name: clubDetail.hall.name,
				addressId: address.id,
				isDefaultChoice: true,
				clubSeasonId: clubSeasonId,
			})
			.returning('id');
	}
}
