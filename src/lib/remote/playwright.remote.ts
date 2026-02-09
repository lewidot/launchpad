import { command } from '$app/server';
import { runner } from '$lib/server/instance';
import { StartSchema } from '$lib/server/playwright';
import { error } from '@sveltejs/kit';

export const startTests = command(StartSchema, async (schema) => {
	const result = runner.start(schema);
	if (result.isErr()) {
		error(409, result.error);
	}
	return { status: 'started' };
});

export const pullLatest = command(async () => {
	const result = runner.pull();
	if (result.isErr()) {
		error(409, result.error);
	}
	return { status: 'started' };
});
