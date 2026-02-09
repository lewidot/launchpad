import { command } from '$app/server';
import * as v from 'valibot';
import { runner } from '$lib/server/instance';

export const startTests = command(v.optional(v.string()), async (filter) => {
	const result = runner.start(filter ?? undefined);
	if (result.isErr()) {
		return { ok: false, error: result.error } as const;
	}
	return { ok: true } as const;
});

export const pullLatest = command(async () => {
	const result = runner.pull();
	if (result.isErr()) {
		return { ok: false, error: result.error } as const;
	}
	return { ok: true } as const;
});
