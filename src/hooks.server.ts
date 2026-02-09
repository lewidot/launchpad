import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const start = performance.now();
	const response = await resolve(event);
	const duration = (performance.now() - start).toFixed(1);

	console.log(
		`[http] ${event.request.method} ${event.url.pathname} ${response.status} ${duration}ms`
	);

	return response;
};
