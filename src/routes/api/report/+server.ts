import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PROJECT_DIR = './pw-project';

export async function GET() {
	try {
		const report = await readFile(resolve(PROJECT_DIR, 'playwright-report/index.html'));
		return new Response(report, {
			headers: {
				'Content-Type': 'text/html',
				'Content-Disposition': 'attachment; filename="playwright-report.html"'
			}
		});
	} catch {
		error(404, 'No report found');
	}
}
