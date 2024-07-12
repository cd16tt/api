import type { InferHashers } from '@adonisjs/core/types';

import { defineConfig, drivers } from '@adonisjs/core/hash';

const hashConfig = defineConfig({
	default: 'scrypt',

	list: {
		scrypt: drivers.scrypt({
			cost: 16_384,
			blockSize: 8,
			parallelization: 1,
			maxMemory: 33_554_432,
		}),
	},
});

export default hashConfig;

declare module '@adonisjs/core/types' {
	export interface HashersList extends InferHashers<typeof hashConfig> {}
}
