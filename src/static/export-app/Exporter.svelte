<style lang="scss">
	p {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	h1 {
		text-align: left;
		margin: 0;
		flex: 1;
	}
	button,
	a[download] {
		align-self: center;
	}
	.container {
		align-self: start;
		width: 30rem;
		max-width: 95vw;
		margin: 1rem auto;
	}

	.export-stats {
		align-self: center;
		background: var(--shdx-gray-600);
		color: white;
		border-radius: 5px;
		text-align: center;

		.stat-num {
			font-size: var(--shdx-font-size-8);
		}
		.stat-name {
			font-size: var(--shdx-font-size-3);
			margin: var(--shdx-spacing-1);
			text-transform: uppercase;
			font-weight: bold;
		}
	}
</style>

<div class="container">
	<div class="f-row">
		<h1>Export</h1>
		{#if !$phrasesDeleted}
			<button on:click={() => dispatch('back')}><Icon icon="angle-left" />Back</button>
		{/if}
	</div>

	<div class="panel-body f-column">
		{#if numCards > 0}
			<div class="export-stats f-row gap-3 px-2">
				<div class="stat">
					<div class="stat-num">
						{numCards}
					</div>
					<div class="stat-name">
						{numCards === 1 ? 'card' : 'cards'}
					</div>
				</div>
				<div class="stat">
					<div class="stat-num">
						{numPhrases}
					</div>
					<div class="stat-name">
						{numPhrases === 1 ? 'phrase' : 'phrases'}
					</div>
				</div>
			</div>
			<p class="jp text-align-center">You created cards for: {getWordsFromCards($cards)}</p>
			<div>
				<h2 class="mb-0">Importing to Anki</h2>
				<TabList bind:selectedTab {tabs} />
				<div class="mt-4">
					<Tab {selectedTab} tabId="ac">
						<AnkiConnect />
					</Tab>
					<Tab {selectedTab} tabId="txt">
						<div class="text-align-center">
							<a
								class="button"
								class:galaxy={!$downloadedDeck}
								href={exported.href}
								on:click={() => enableDelete()}
								on:contextmenu={() => enableDelete(2000)}
								download={exported.fileName}
							>
								<Icon icon="download" />Download Deck
							</a>
						</div>
						<ol>
							<li>Select a deck in Anki, then hit "File" → "Import..."</li>
							<li>Ensure "Allow HTML in Fields" is checked, and "Fields separated by" is set to semicolon.</li>
							<li>
								Field mapping should be <strong>Field 1: Front, Field 2: Back.</strong> This will probably be the default.
							</li>
						</ol>
					</Tab>
				</div>
			</div>
			<div class="text-align-center mt-5">
				{#if $deckConsumed && !$phrasesDeleted}
					<div class="f-row justify-content-center">
						<button
							on:click={deleteConsumed}
							disabled={!$deckConsumed}
							class="danger"
							title={!$downloadedDeck ? 'not available until the anki export is downloaded' : ''}
						>
							<Icon icon="trash" />
							Delete the {numPhrases} used context {numPhrases === 1 ? 'sentence' : 'sentences'}
						</button>

						{#if $unusedPhrases.length > 0}
							<button
								on:click={() => (showDeleteAll = true)}
								disabled={!$deckConsumed}
								class="danger"
								title={!$downloadedDeck ? 'not available until the anki export is downloaded' : ''}
							>
								<Icon icon="trash" />
								Delete all {$phraseStore.length} context {$phraseStore.length === 1 ? 'sentence' : 'sentences'}
							</button>
						{/if}
					</div>
				{/if}
				{#if deleting}
					{#await deleting}
						<Loading />
					{:catch}
						<p>An error occurred deleting phrases!</p>
					{/await}
				{/if}
				{#if $deckConsumed}
					<br />
					<button class="primary" on:click={() => dispatch('restart')}>
						<Icon icon="redo" />
						Start Over
					</button>
				{/if}
			</div>
		{:else}
			<p>You didn't create any cards!</p>
			<button on:click={() => dispatch('restart')}>Start Over</button>
		{/if}
	</div>
</div>

{#if showDeleteAll}
	<Modal bind:visible={showDeleteAll} title="Delete All Phrases?">
		<DeleteAllModal bind:visible={showDeleteAll} on:delete-all={deleteAll} />
	</Modal>
{/if}

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import phraseStore from '../stores/phrases';
	import {
		cardCount,
		usedPhrases,
		unusedPhrases,
		cards,
		downloadedDeck,
		phrasesDeleted,
		deckConsumed,
	} from '../stores/cards';
	import Loading from '../Loading.svelte';
	import { Icon, Modal, TabList, Tab } from 'sheodox-ui';
	import SRSConstructor from './SRSConstructor';
	import DeleteAllModal from './DeleteAllModal.svelte';
	import type { Card } from '../types/cards';
	import AnkiConnect from './AnkiConnect.svelte';

	let showDeleteAll = false,
		selectedTab: string,
		deleting: Promise<any>;

	const tabs = [
		{
			id: 'ac',
			title: 'Anki-Connect (recommended)',
		},
		{
			id: 'txt',
			title: 'Manual Import',
		},
	];

	const dispatch = createEventDispatcher<{
			restart: void;
			back: void;
		}>(),
		srs = new SRSConstructor(),
		numCards = get(cardCount),
		consumedPhrases = get(usedPhrases),
		numPhrases = consumedPhrases.length;

	srs.addCards(get(cards));
	const exported = srs.exportTextFile();

	function getWordsFromCards(cards: Card[]) {
		return cards.map(({ word }) => word).join(', ') + '.';
	}

	function enableDelete(delay = 0) {
		//to prevent the user from deleting the phrases they used and forgetting to download the deck, we don't enable
		//the button until they've interacted with the download link. this is called from a timer on right click because it's
		//assumed they're trying to hit "Save Link As..." and that just takes a bit longer
		setTimeout(() => {
			downloadedDeck.set(true);
		}, delay);
	}

	async function deleteConsumed() {
		// if we're essentially deleting all phrases, just do that instead
		if ($unusedPhrases.length === 0) {
			return await deleteAll();
		}

		const phrases = get(phraseStore);
		//find the phrase IDs from each phrase
		const ids = consumedPhrases
			.map((contextSentence) => {
				const phrase = phrases.find(({ phrase }) => {
					return phrase === contextSentence;
				});
				if (phrase) {
					return phrase.id;
				}
			})
			.filter((id) => !!id);

		if (ids.length) {
			await phraseStore.remove(ids);
		}
		$phrasesDeleted = true;
	}

	async function deleteAll() {
		showDeleteAll = false;
		await phraseStore.remove(get(phraseStore).map((p) => p.id));
		$phrasesDeleted = true;
		// if all phrases have been deleted, automatically start over so it resets the card stores
		// for the next export if they keep the site open
		dispatch('restart');
	}
</script>
