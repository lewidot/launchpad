import type { RequestHandler } from './$types';
import { broker } from '$lib/server/instance';

export const GET: RequestHandler = ({ request }) => {
	const { readable, unsubscribe } = broker.subscribe();

	request.signal.onabort = () => unsubscribe();

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
