import { createSmartpingInstance, Credentials } from '@smartping-api/core';

import env from '#start/env';

export const Smartping = createSmartpingInstance({
	credentials: new Credentials(env.get('SMARTPING_ID'), env.get('SMARTPING_KEY')),
});
