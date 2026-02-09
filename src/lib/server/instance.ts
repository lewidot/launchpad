// src/lib/server/instance.ts
import { PlaywrightRunner } from '$lib/server/playwright';
import { SSEBroker } from '$lib/server/sse';

export const broker = new SSEBroker();

export const runner = new PlaywrightRunner({
	onOutput: (chunk) => console.log(chunk),
	onStateChange: (state, exitCode) => {
		console.log({ state, exitCode });
	}
});

// export const runner = new PlaywrightRunner({
// 	onOutput: (chunk) => broker.sendEvent('output', chunk),
// 	onStateChange: (state, exitCode) => {
// 		broker.sendEvent('state', JSON.stringify({ state, exitCode }));
// 	}
// });
