<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Toaster richColors theme="light" />
<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-6xl px-6 py-12">
		<header class="mb-8">
			<h1 class="text-xl font-semibold tracking-tight">launchpad.</h1>
			<p class="font-mono text-sm text-muted-foreground">Test automation platform</p>
		</header>
		{@render children()}
	</div>
</div>
