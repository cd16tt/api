import { ValueOf } from 'type-fest';

export type UserRole = 'committee_member' | 'licensee' | 'club_admin' | 'referee';

export const permissions = {
	committee: {
		'users.index': 'com:users.index',
		'users.show': 'com:users.show',
		'users.update': 'com:users.update',
		'users.delete': 'com:users.delete',
		'invitation.create': 'com:invitation.create',
		'invitation.show': 'com:invitation.show',
	},
	club: {},
	player: {},
	referee: {},
} as const;

// eslint-disable-next-line unicorn/no-array-reduce
export const flatPermissions = Object.entries(permissions).reduce<Array<Permission>>(
	(acc, [, value]) => {
		for (const [, v] of Object.entries(value)) {
			acc.push(v);
		}

		return acc;
	},
	['*'],
);

export type CommitteePermission = ValueOf<(typeof permissions)['committee']>;
export type ClubPermission = ValueOf<(typeof permissions)['club']>;
export type PlayerPermission = ValueOf<(typeof permissions)['player']>;
export type RefereePermission = ValueOf<(typeof permissions)['referee']>;
export type Permission = CommitteePermission | '*';
