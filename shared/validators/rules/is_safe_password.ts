import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { isString } from 'radash';

export async function havePasswordBeenPwned(password: string): Promise<boolean> {
	const uInt8Password = new TextEncoder().encode(password);
	const hash = await crypto.subtle.digest('SHA-1', uInt8Password);
	const hashHex = [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

	const response = await fetch('https://api.pwnedpasswords.com/range/' + hashHex.slice(0, 5));

	if (response.status !== 200) {
		return false;
	}

	const body = await response.text();
	const hashes = body.split('\n').map((line) => {
		const [hash, count] = line.split(':');
		return {
			hash,
			count: count ? Number.parseInt(count, 10) : 0,
		};
	});

	const hashSuffix = hashHex.slice(5).toUpperCase();
	const result = hashes.find(({ hash }) => hash === hashSuffix);

	if (!result) return false;

	return result.count > 3;
}

export const isSafePassword = vine.createRule(
	async (value: unknown, _options: undefined, field: FieldContext) => {
		if (!field.isValid) return;

		if (!value || !isString(value)) return;

		const pwned = await havePasswordBeenPwned(value);

		if (pwned) {
			field.report(
				"Ce mot de passe a fait l'objet d'une fuite de données, il ne doit pas être utilisé. Veuillez utiliser un autre mot de passe.",
				'security.pwned',
				field,
			);
		}
	},
	{ implicit: true, isAsync: true },
);
