<style>
	textarea {
		height: 10rem;
		width: 100%;
		resize: vertical;
		font-size: 0.8rem;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	form button {
		align-self: end;
	}
	.recommended {
		text-align: center;
		color: var(--shdx-primary);
	}
</style>

<Layout title="Import Plain Text">
	<div class="f-column f-1 align-items-center">
		{#if !phrases}
			<p class="mt-0">
				You can paste text in bulk here to be imported. It will will be split into individual sentences between
				punctuation and line breaks.
			</p>
			<form on:submit|preventDefault={splitPhrases}>
				<label for="bulk-phrase-add-input"> Phrases </label>
				<br />
				<textarea id="bulk-phrase-add-input" bind:value={phraseText} />
				<div class="mt-2">
					<Checkbox id="split-on-spaces" bind:checked={splitOnSpaces}>
						Treat space separated text as individual phrases <span class="muted"
							>(use this if you have a bunch of vocab separated only by spaces)</span
						>
					</Checkbox>
				</div>
				{#if recommendSplitting && !splitOnSpaces}
					<p class="recommended">
						<Icon icon="hat-wizard" />
						This is a really long phrase, do you need to treat this as separate phrases separated by spaces?
					</p>
				{/if}
				<br />
				<button class="primary" disabled={!phraseText}>Show Phrases</button>
			</form>
		{:else}
			<button on:click={discard}><Icon icon="times" />Discard</button>
		{/if}

		{#if phrases}
			<ImportPhraseList {phrases} bind:numSelected />
		{/if}
	</div>
</Layout>

<script lang="ts">
	import { Icon, Checkbox } from 'sheodox-ui';
	import ImportPhraseList from './ImportPhraseList.svelte';
	import Layout from '../pages/Layout.svelte';
	import { splitIntoPhrases } from '../../shared/phrase-utils';

	let phrases: string[],
		numSelected = 0,
		phraseText = '',
		splitOnSpaces = false;

	$: recommendSplitting = phraseText.length > 100 && !/[。！？\n]/.test(phraseText);

	function splitPhrases() {
		//by turning spaces into newlines the we can treat space delimited words as individual phrases
		const normalized = !splitOnSpaces ? phraseText : phraseText.replace(/\s+/g, '\n');
		phrases = splitIntoPhrases(normalized);
	}

	function discard() {
		if (
			numSelected === 0 ||
			confirm("You have selected phrases but haven't added them yet, are you sure you want to cancel?")
		) {
			phrases = null;
		}
	}
</script>
