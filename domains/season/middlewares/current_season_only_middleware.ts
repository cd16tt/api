import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

import { inject } from '@adonisjs/core';
import vine from '@vinejs/vine';

import SeasonRepository from '#domains/season/repositories/season_repository';
import { uidRegex } from '#shared/services/uid_generator';

const qsSchema = vine.compile(
	vine.object({
		seasonUid: vine.string().regex(uidRegex).optional(),
	}),
);

@inject()
export default class CurrentSeasonOnlyMiddleware {
	constructor(private readonly seasonRepository: SeasonRepository) {}

	async handle({ request, response }: HttpContext, next: NextFn) {
		const currentSeason = await this.seasonRepository.getCurrentSeason().selectTakeFirst('uid');

		if (currentSeason === null) {
			return response.badRequest({ message: 'Aucune saison en cours.' });
		}

		const queryParameters = await qsSchema.validate(request.qs());

		if (queryParameters.seasonUid && queryParameters.seasonUid !== currentSeason?.uid) {
			return response.badRequest({
				message: "La saison sélectionnée n'est pas la saison en cours. Toutes les actions de modification sont interdites.",
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
