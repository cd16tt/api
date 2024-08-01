import path from 'node:path';

import app from '@adonisjs/core/services/app';
import { icons as heroIcons } from '@iconify-json/heroicons';
import { addCollection, edgeIconify } from 'edge-iconify';
import edge from 'edge.js';

import env from '#start/env';

const domainsPath = app.makePath('domains');

edge.mount('auth', path.join(domainsPath, 'auth/emails/templates'));
addCollection(heroIcons);
edge.use(edgeIconify);
edge.global('config', {
	publicUrl: env.get('PUBLIC_URL'),
});
