import { ApplicationService } from '@adonisjs/core/types';
import { DateTime } from 'luxon';

import SeasonRepository from '#domains/season/repositories/season_repository';
import { date } from '#shared/services/date_factory';

export const SeasonSeeder = {
	async run(app: ApplicationService) {
		const seasonRepository = await app.container.make(SeasonRepository);

		// Create admin related licensee
		return seasonRepository
			.create({
				startDate: DateTime.fromObject({ year: 2024, month: 7, day: 1 }).toSQL() ?? date().toSQL(),
				endDate: DateTime.fromObject({ year: 2025, month: 6, day: 30 }).toSQL() ?? date().toSQL(),
				isCurrent: true,
			})
			.returning('id');
	},
};
