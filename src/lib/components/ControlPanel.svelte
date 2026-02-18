<script lang="ts">
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Download from '@lucide/svelte/icons/download';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { ProjectState } from '$lib/server/playwright';
	import { startTests, pullLatest } from '$lib/remote/playwright.remote';
	import { isHttpError } from '@sveltejs/kit';

	type Props = {
		status: ProjectState;
		isBusy: boolean;
	};

	let { status, isBusy }: Props = $props();

	let filter = $state('');

	async function downloadReport() {
		const response = await fetch('/api/report');

		if (!response.ok) {
			const error = await response.json();
			toast.error(error.message ?? 'Failed to download report');
			return;
		}

		// trigger download
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'playwright-report.html';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex w-64 shrink-0 flex-col">
	<Tabs.Root value="tests" class="flex-1">
		<Tabs.List>
			<Tabs.Trigger value="tests">Tests</Tabs.Trigger>
			<Tabs.Trigger value="updates">Updates</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="tests">
			<Card.Root>
				<Card.Content>
					<div class="grid gap-2">
						<Label for="filter">Filter</Label>
						<Input
							id="filter"
							type="text"
							placeholder="e.g. @smoke"
							bind:value={filter}
							disabled={isBusy}
							autocomplete="off"
						/>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button
						onclick={async () => {
							try {
								await startTests({ filter });
							} catch (error) {
								toast.error(isHttpError(error) ? error.body.message : 'Failed to start tests');
							}
						}}
						disabled={isBusy}
						class="w-full"
					>
						{#if status === 'running-start'}
							<Loader2Icon class="animate-spin" />
							Running...
						{:else}
							Run Tests
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="updates">
			<Card.Root>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Pull the latest changes and update dependencies.
					</p>
				</Card.Content>
				<Card.Footer>
					<Button
						onclick={async () => {
							try {
								await pullLatest();
							} catch (error) {
								toast.error(isHttpError(error) ? error.body.message : 'Failed to pull changes');
							}
						}}
						disabled={isBusy}
						variant="outline"
						class="w-full"
					>
						{#if status === 'running-pull'}
							<Loader2Icon class="animate-spin" />
							Pulling changes...
						{:else}
							Pull Changes
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>

	<Button variant="outline" class="mt-4 w-full" disabled={isBusy} onclick={downloadReport}>
		Download Latest Report <Download />
	</Button>
</div>
