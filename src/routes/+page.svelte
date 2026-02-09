<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';
	import { startTests, pullLatest } from '$lib/remote/playwright.remote';
	import { onMount } from 'svelte';

	let filter = $state('');
	let message = $state('');
	let output = $state('');
	let projectState = $state('idle');

	onMount(() => {
		const es = new EventSource('/events');

		es.addEventListener('output', (e) => {
			output += e.data + '\n';
		});

		es.addEventListener('state', (e) => {
			const { state, exitCode } = JSON.parse(e.data);
			projectState = state;
			if (state === 'idle') {
				message = exitCode === 0 ? 'Finished successfully' : `Exited with code ${exitCode}`;
			}
		});

		return () => es.close();
	});

	async function runTests() {
		try {
			output = '';
			await startTests({ filter: filter || undefined });
			message = 'Tests started';
		} catch (e) {
			message = isHttpError(e) ? e.body.message : 'Failed to start tests';
		}
	}

	async function pull() {
		try {
			output = '';
			await pullLatest();
			message = 'Pull started';
		} catch (e) {
			message = isHttpError(e) ? e.body.message : 'Failed to pull';
		}
	}
</script>

<div>
	<input bind:value={filter} placeholder="Test filter (optional)" />
	<button onclick={runTests} disabled={projectState !== 'idle'}>Run Tests</button>
	<button onclick={pull} disabled={projectState !== 'idle'}>Pull & Install</button>

	{#if message}
		<p>{message}</p>
	{/if}

	{#if output}
		<pre>{output}</pre>
	{/if}
</div>
