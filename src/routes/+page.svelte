<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';
	import { startTests, pullLatest } from '$lib/remote/playwright.remote';

	let filter = $state('');
	let message = $state('');

	async function runTests() {
		try {
			await startTests({ filter: filter || undefined });
			message = 'Tests started';
		} catch (e) {
			message = isHttpError(e) ? e.body.message : 'Failed to start tests';
		}
	}

	async function pull() {
		try {
			await pullLatest();
			message = 'Pull started';
		} catch (e) {
			message = isHttpError(e) ? e.body.message : 'Failed to pull';
		}
	}
</script>

<div>
	<input bind:value={filter} placeholder="Test filter (optional)" />
	<button onclick={runTests}>Run Tests</button>
	<button onclick={pull}>Pull & Install</button>

	{#if message}
		<p>{message}</p>
	{/if}
</div>
