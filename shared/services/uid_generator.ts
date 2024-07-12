import type { Request, Response } from '@adonisjs/core/http';

import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789', 20);

export type Uid = string;

export function generateUid() {
	return nanoId();
}

export const uidRegex = /^[\dA-Za-z]{20}$/;

export function getRequestUidOrFail(request: Request, response: Response) {
	const parameter = request.param('uid', null) as Uid | null;

	if (!parameter) {
		response.abort(400);
	}

	return parameter;
}
