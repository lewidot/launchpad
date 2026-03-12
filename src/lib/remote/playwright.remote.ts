import { command } from '$app/server';
import { runner } from '$lib/server/instance';
import { StartSchema } from '$lib/server/playwright';
import { error } from '@sveltejs/kit';

export const startTestsRemote = command(StartSchema, async (schema) => {
	const result = runner.start(schema);
	if (result.isErr()) {
		error(409, result.error);
	}
	return { status: 'started' };
});

export const pullLatestRemote = command(async () => {
	const result = runner.pull();
	if (result.isErr()) {
		error(409, result.error);
	}
	return { status: 'started' };
});
