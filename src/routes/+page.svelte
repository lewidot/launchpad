<script lang="ts">
	import { startTests, pullLatest } from '$lib/remote/playwright.remote';

	let filter = $state('');
	let message = $state('');
	let status = $state<{ state: string; output: string } | null>(null);

	async function runTests() {
		const result = await startTests(filter || undefined);
		message = result.ok ? 'Tests started' : result.error;
	}

	async function pull() {
		const result = await pullLatest();
		message = result.ok ? 'Pull started' : result.error;
	}
</script>

<div>
	<input bind:value={filter} placeholder="Test filter (optional)" />
	<button onclick={runTests}>Run Tests</button>
	<button onclick={pull}>Pull & Install</button>

	{#if message}
		<p>{message}</p>
	{/if}

	{#if status}
		<p>State: {status.state}</p>
		<pre>{status.output}</pre>
	{/if}
</div>
