import type { SmartpingClub, SmartpingClubDetail } from '@smartping-api/core';

import app from '@adonisjs/core/services/app';

import AddressRepository from '#domains/address/repositories/address_repository';
import ClubRepository from '#domains/club/repositories/club_repository';
import ClubSeasonRepository from '#domains/club/repositories/club_season_repository';
import ClubSocialRepository from '#domains/club/repositories/club_social_repository';
import HallRepository from '#domains/club/repositories/hall_repository';
import ClubLicenseeRepository from '#domains/licensee/repositories/club_licensee_repository';
import LicenseeRepository from '#domains/licensee/repositories/licensee_repository';
import { date } from '#shared/services/date_factory';
import { Smartping } from '#shared/services/smartping';

export default class SmartpingImporterService {
	async importClubs(seasonId: number, smartping: typeof Smartping) {
		const clubRepository = await app.container.make(ClubRepository);

		/** Récupération des clubs du département */
		const clubsToSync = await smartping.clubs.findByDepartment('16');
		const clubs: Array<{ clubCode: string; clubId: number; clubSeasonId: number }> = [];

		/** Récupération des clubs déjà existants en base */
		const existingClubs = await clubRepository.getAllClubCodes();

		/** Création/MAJ des clubs en base */
		for (const clubToSync of clubsToSync) {
			const clubId = await this.#getOrCreateClub(clubToSync, existingClubs, smartping);

			if (!clubId) continue;

			const clubSeasonId = await this.#getOrCreateClubSeason(clubId, seasonId, clubToSync);

			if (!clubSeasonId) continue;

			await clubToSync.preload(['details']);
			const clubDetail = clubToSync.details;

			if (!clubDetail) continue;

			await this.#createClubSocial(clubSeasonId, clubDetail);
			await this.#createClubAddress(clubSeasonId, clubDetail);

			clubs.push({
				clubCode: clubToSync.code,
				clubId: clubId,
				clubSeasonId: clubSeasonId,
			});
		}

		return clubs;
	}

	async importLicensees(seasonId: number, smartping: typeof Smartping) {
		const licenseeRepository = await app.container.make(LicenseeRepository);
		const clubLicenseeRepository = await app.container.make(ClubLicenseeRepository);
		const clubs = await this.importClubs(seasonId, smartping);

		for (const club of clubs) {
			const licenseesToSync = await smartping.players.findByClub(club.clubCode);

			for (const licenseeToSync of licenseesToSync) {
				let licensee = await licenseeRepository.findBy([['code', licenseeToSync.licence]]).selectTakeFirst('id');

				if (licensee === undefined) {
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

				const maybeClubLicensee = await clubLicenseeRepository
					.findBy([
						['licenseeId', licensee.id],
						['clubSeasonId', club.clubSeasonId],
					])
					.selectTakeFirst('id');

				if (maybeClubLicensee) continue;

				await clubLicenseeRepository
					.create({
						clubSeasonId: club.clubSeasonId,
						licenseeId: licensee.id,
						transferredAt: date().toSQL(),
					})
					.returning('id');
			}
		}
	}

	async #getOrCreateClub(
		clubToSync: SmartpingClub,
		existingClubs: Record<string, number>,
		smartping: typeof Smartping,
	): Promise<number | undefined> {
		const clubRepository = await app.container.make(ClubRepository);
		const clubDetail = await smartping.clubs.findByCode(clubToSync.code);

		/** Si le club n'est pas validé, on ne le prend pas en compte */
		if (!clubDetail?.validatedAt) return;

		const existingClub = existingClubs[clubDetail.code];

		if (existingClub) {
			return existingClub;
		}

		/** Si le club n'existe pas en base, on le crée */
		const club = await clubRepository
			.create({
				code: clubDetail.code,
				federationId: clubDetail.id,
			})
			.returning('id');

		/** Si le club ne peut pas être créé, on abort early et on passe au suivant */
		if (!club) {
			return;
		}

		return club.id;
	}

	async #getOrCreateClubSeason(clubId: number, seasonId: number, clubToSync: SmartpingClub) {
		const clubSeasonRepository = await app.container.make(ClubSeasonRepository);
		const clubSeason = await clubSeasonRepository
			.findBy([
				['clubId', clubId],
				['seasonId', seasonId],
			])
			.selectTakeFirst('id');

		if (clubSeason) {
			return clubSeason.id;
		}

		const newClubSeason = await clubSeasonRepository
			.create({
				clubId: clubId,
				seasonId: seasonId,
				name: clubToSync.name,
				validatedAt: date(clubToSync.validatedAt).toSQL(),
			})
			.returning('id');

		if (!newClubSeason) {
			return;
		}

		return newClubSeason.id;
	}

	async #createClubSocial(clubSeasonId: number, clubDetail: SmartpingClubDetail) {
		if (!clubDetail.website) return;

		const clubSocialRepository = await app.container.make(ClubSocialRepository);
		await clubSocialRepository
			.create({
				name: 'Site internet',
				uri: clubDetail.website,
				clubSeasonId: clubSeasonId,
			})
			.returning('id');
	}

	async #createClubAddress(clubSeasonId: number, clubDetail: SmartpingClubDetail) {
		const addressRepository = await app.container.make(AddressRepository);
		const hallRepository = await app.container.make(HallRepository);

		let address = await addressRepository
			.findBy([
				['addressLine1', clubDetail.hallAddress1],
				['postalCode', clubDetail.hallPostalCode],
			])
			.selectTakeFirst('id');

		if (!address) {
			address = await addressRepository
				.create({
					addressLine1: clubDetail.hallAddress1,
					addressLine2: clubDetail.hallAddress2 ?? null,
					addressLine3: clubDetail.hallAddress3 ?? null,
					city: clubDetail.hallCity,
					postalCode: clubDetail.hallPostalCode,
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
				name: clubDetail.hallName,
				addressId: address.id,
				isDefaultChoice: true,
				clubSeasonId: clubSeasonId,
			})
			.returning('id');
	}
}
