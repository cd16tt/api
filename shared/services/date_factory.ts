import { DateTime } from 'luxon';

class DateCreationError extends Error {
	constructor() {
		super('Invalid date');
	}
}

export function date(date?: DateTime | Date | string): DateTime<true> {
	if (!date) {
		return DateTime.now();
	}

	if (date instanceof DateTime) {
		if (!date.isValid) {
			throw new DateCreationError();
		}

		return date;
	}

	if (date instanceof Date) {
		const dateObject = DateTime.fromJSDate(date);

		if (!dateObject.isValid) {
			throw new DateCreationError();
		}

		return dateObject;
	}

	const dateObject = DateTime.fromSQL(date);

	if (!dateObject.isValid) {
		throw new DateCreationError();
	}

	return dateObject;
}
