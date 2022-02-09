<style>
	label {
		display: block;
		margin-bottom: var(--shdx-spacing-2);
		font-size: var(--shdx-font-size-4);
	}
	select {
		width: 100%;
	}
</style>

{#if $ankiConnectStatus === 'unavailable'}
	<p>Cards can be added easiest with the Anki-Connect plugin for Anki.</p>
	<p class="has-inline-links">
		First install <ExternalLink href="https://foosoft.net/projects/anki-connect/">Anki-Connect</ExternalLink>. Then with
		Anki open click Request Permission below and accept the popup in Anki.
	</p>
	<p class="fw-bold">Anki must be kept open to import cards.</p>
	<button class="primary" on:click={requestPermission}>Request Permission</button>
{:else if $ankiConnectStatus === 'available' && !$deckImported}
	<label for="anki-deck">Select an Anki deck for the new cards</label>
	<select id="anki-deck" size={$ankiDecks.length} bind:value={$selectedAnkiDeck}>
		{#each $ankiDecks as deck}
			<option value={deck.id}>{deck.name}</option>
		{/each}
	</select>
	<div class="f-row justify-content-between">
		<button on:click={newDeck}>New Deck</button>
		<button on:click={importCards} class="primary" disabled={adding || $selectedAnkiDeck === null}>Add to Deck</button>
	</div>
{:else if $deckImported}
	<p class="text-align-center">Congrats, you're done!</p>
{/if}

<script lang="ts">
	import { createAutoExpireToast } from 'sheodox-ui';
	import ExternalLink from '../ExternalLink.svelte';
	import {
		ankiDecks,
		ankiConnectStatus,
		newDeck,
		importCards as importCardAction,
		selectedAnkiDeck,
		requestPermission,
	} from '../stores/anki-connect';
	import { deckImported } from '../stores/cards';

	let adding = false;

	async function importCards() {
		adding = true;
		const { error } = await importCardAction();

		if (error) {
			createAutoExpireToast({
				variant: 'error',
				title: 'Error',
				message: 'An error occurred importing cards into Anki',
				technicalDetails: error,
			});
		} else {
			$deckImported = true;
		}
		adding = false;
	}
</script>
