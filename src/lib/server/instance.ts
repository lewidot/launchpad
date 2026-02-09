// src/lib/server/instance.ts
import { PlaywrightRunner } from '$lib/server/playwright';
import { SSEBroker } from '$lib/server/sse';

export const broker = new SSEBroker();

export const runner = new PlaywrightRunner({
	onOutput: (chunk) => broker.sendEvent('output', chunk),
	onStateChange: (state, code) => broker.sendEvent('state', JSON.stringify({ state, code }))
});
