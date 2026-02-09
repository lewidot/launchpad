<script lang="ts">
	import type { ProjectState } from '$lib/server/playwright';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import OutputPanel from '$lib/components/OutputPanel.svelte';

	let status = $state<ProjectState>('idle');

	const isBusy = $derived(status !== 'idle');
</script>

<div class="flex gap-6">
	<ControlPanel {status} {isBusy} />
	<OutputPanel bind:status {isBusy} />
</div>
