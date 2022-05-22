<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.toolbar {
		width: 100%;
		border-bottom: 1px solid var(--sx-gray-500);
	}
	section {
		width: 100%;
	}
</style>

<section class="py-4 f-column f-1">
	<div class="f-1 f-row justify-content-between toolbar mb-5">
		<div>
			<button on:click={addAll}>
				<Icon icon="plus-square" />
				Select All</button
			>
			<button on:click={clearAll}>
				<Icon icon="minus-square" />
				Clear All</button
			>
		</div>
		<button class="primary" disabled={submitting || phrasesToAdd.length === 0} on:click={submit}>
			Add {phrasesToAdd.length} Selected Phrase{phrasesToAdd.length === 1 ? '' : 's'}
		</button>
	</div>

	<ul class="f-column gap-3">
		{#each phrases as phrase}
			<li>
				<label class="sx-font-size-4 jp">
					<input type="checkbox" value={phrase} bind:group={phrasesToAdd} />
					{phrase}
				</label>
			</li>
		{:else}
			{#if hadPhrases}
				<li>
					<p class="text-align-center">You're done! Congrats!</p>
				</li>
			{:else}
				<li class="has-inline-links">
					No subtitles were found in that subtitle file. If you think this is wrong please <ExternalLink
						href="https://github.com/sheodox/context.reviews/issues/new">report the issue</ExternalLink
					> so it can be fixed.
				</li>
			{/if}
		{/each}
	</ul>
</section>

<script lang="ts">
	import { createAutoExpireToast, Icon } from 'sheodox-ui';
	import ExternalLink from '../ExternalLink.svelte';

	export let phrases: string[];
	export let numSelected = 0;
	let phrasesToAdd: string[] = [],
		hadPhrases = false,
		submitting = false;

	$: numSelected = phrasesToAdd.length;
	// used to determine if we show an error message or a "you're done!" message when no phrases remain
	$: hadPhrases = hadPhrases || phrases.length > 0;

	function addAll() {
		phrasesToAdd = phrases;
	}

	function clearAll() {
		phrasesToAdd = [];
	}

	async function submit() {
		submitting = true;
		const res = await fetch(`/phrases/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phraseText: phrasesToAdd }),
		});

		if (res.ok) {
			//filter out any phrases that have been added, in case they want to add more
			phrases = phrases.filter((phrase) => !phrasesToAdd.includes(phrase));
			clearAll();
		} else {
			createAutoExpireToast({
				variant: 'error',
				title: 'Error',
				message: 'There was a problem encountered adding these phrases.',
			});
		}
		submitting = false;
	}
</script>
