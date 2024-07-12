import { writeFile } from 'node:fs/promises';

import app from '@adonisjs/core/services/app';
import { SmartpingClub, SmartpingClubDetail, SmartpingPlayer } from '@smartping-api/core';

import { Smartping } from '#shared/services/smartping';

export default class SmartpingJsonExporterService {
	async importClubs(smartping: typeof Smartping) {
		/** Récupération des clubs du département */
		const clubsToSync = await smartping.clubs.findByDepartment('16');
		const clubs: Array<{
			club: ReturnType<SmartpingClub['serialize']>;
			clubDetail: ReturnType<SmartpingClubDetail['serialize']> | undefined;
		}> = [];

		/** Création/MAJ des clubs en base */
		for (const clubToSync of clubsToSync) {
			await clubToSync.preload(['details']);
			const clubDetail = clubToSync.details;

			clubs.push({
				club: clubToSync.serialize(),
				clubDetail: clubDetail?.serialize(),
			});
		}

		await writeFile(app.tmpPath('clubs.json'), JSON.stringify(clubs, null, 2));

		return clubs;
	}

	async importLicensees(smartping: typeof Smartping) {
		const clubs = await this.importClubs(smartping);
		const licensees: Record<string, Array<ReturnType<SmartpingPlayer['serialize']>>> = {};

		for (const club of clubs) {
			const licenseesToSync = await smartping.players.findByClub(club.club.code);

			for (const licenseeToSync of licenseesToSync) {
				if (!licensees[club.club.code] || licensees[club.club.code]!.length === 0) {
					licensees[club.club.code] = [];
				}

				licensees[club.club.code]!.push(licenseeToSync.serialize());
			}
		}

		await writeFile(app.tmpPath('licensees.json'), JSON.stringify(licensees, null, 2));
	}
}
