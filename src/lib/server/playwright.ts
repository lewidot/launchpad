import { spawn, type ChildProcess } from 'node:child_process';
import { ok, err, type Result } from 'neverthrow';
import type { Readable } from 'node:stream';
import * as v from 'valibot';

export const StartSchema = v.object({
	filter: v.optional(v.string())
});

export type StartOptions = v.InferInput<typeof StartSchema>;
export type ProjectState = 'running-start' | 'running-pull' | 'idle';

export type OutputHandler = {
	onOutput: (chunk: string) => void;
	onStateChange: (state: ProjectState, exitCode?: number) => void;
};

const PROJECT_DIR = './pw-project';

export class PlaywrightRunner {
	private proc: ChildProcess | null = null;

	constructor(private handler: OutputHandler) {}

	get isRunning() {
		return this.proc !== null;
	}

	start(options: StartOptions): Result<void, string> {
		if (this.proc) return err('Already running');

		const cmdPath = './node_modules/.bin/playwright';
		const args = [
			'test',
			'--reporter',
			'list',
			...(options.filter ? ['--grep', options.filter] : [])
		];

		console.log(`[playwright] filter=${options.filter}`);
		this.proc = spawn(cmdPath, args, {
			cwd: PROJECT_DIR,
			stdio: ['ignore', 'pipe', 'pipe']
		});

		console.log('[playwright] spawned pid:', this.proc.pid);
		this.handler.onStateChange('running-start');
		this.handler.onOutput(`${cmdPath} ${args.join(' ')}\n`);
		this.wireStreams();
		return ok();
	}

	pull(): Result<void, string> {
		if (this.proc) return err('Already running');

		const env = { ...process.env };
		for (const key of Object.keys(env)) {
			if (key.toLowerCase().startsWith('npm_config_')) delete env[key];
		}

		const cmd = 'git pull && npm install --include=dev && ./node_modules/.bin/playwright install';

		console.log('[playwright] pulling latest changes');
		this.proc = spawn('sh', ['-c', cmd], {
			cwd: PROJECT_DIR,
			stdio: ['ignore', 'pipe', 'pipe'],
			env: { ...env, CI: 'true' }
		});

		this.handler.onStateChange('running-pull');
		this.handler.onOutput(`${cmd}\n`);
		this.wireStreams();
		return ok();
	}

	private wireStreams() {
		const proc = this.proc!;

		if (proc.stdout) this.streamOutput('stdout', proc.stdout);
		if (proc.stderr) this.streamOutput('stderr', proc.stderr);

		proc.on('error', (err) => {
			console.error('[playwright] spawn error:', err);
			this.handler.onStateChange('idle', 1);
			this.proc = null;
		});

		proc.on('close', (code) => {
			console.log('[playwright] exited with code:', code);
			this.handler.onStateChange('idle', code ?? undefined);
			this.proc = null;
		});
	}

	private async streamOutput(name: string, stream: Readable) {
		console.log(`[playwright] starting to read ${name}`);
		stream.setEncoding('utf-8');
		for await (const chunk of stream) {
			this.handler.onOutput(chunk as string);
		}
		console.log(`[playwright] ${name} done`);
	}
}
