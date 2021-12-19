<style>
	aside {
		flex: 1;
		position: relative;
		border-left: var(--shdx-panel-border);
		min-width: 20rem;
	}
	h2 {
		padding: 0.5rem;
		margin: 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li .word button {
		font-size: 1.5rem;
		padding: 0.5rem;
	}
	li.no-cards {
		font-size: 1rem;
	}
	select {
		width: 100%;
		text-overflow: ellipsis;
	}
	li {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	li .word {
		flex: 1;
	}
	li .remove-card {
		flex: 0;
	}
	.phrase-select {
		margin: 1rem 0;
	}
	.panel-body {
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 900px) {
		aside {
			border-left: none;
			border-top: var(--shdx-panel-border);
		}
	}
</style>

<aside class="panel">
	<div class="panel-body">
		<label for="phrases-processed">
			Phrases Processed ({$currentPhraseIndex}/{$phraseStore.length})
		</label>
		<Progress value={$currentPhraseIndex} max={$phraseStore.length} id="phrases-processed" />
		<div class="phrase-select">
			<label>
				Skip To Phrase
				<select bind:value={$currentPhraseIndex} class="jp">
					{#each Array.from($cardsByPhrase) as [phrase], index}
						<option value={index}>{phrase}</option>
					{/each}
				</select>
			</label>
		</div>
		<h2 class="header">Created Cards</h2>
		<ul>
			{#each cardSlice($cardsByPhrase, $currentPhrase) as card}
				<li in:fade={{ duration: 100 }} on:mouseenter={() => (previewCard = card)}>
					<div class="word">
						<button on:click={() => preview(card)}>
							<JapaneseWord word={card.word} reading={card.reading} />
						</button>
					</div>
					<button on:click={() => removeCard(card)} class="remove-card">
						<Icon icon="times" variant="icon-only" />
						<span class="sr-only">Remove</span>
					</button>
				</li>
			{:else}
				<li class="no-cards">No cards for this phrase yet.</li>
			{/each}
		</ul>

		<button id="export-button" on:click={() => ($showExport = true)} disabled={$cards.length === 0}>
			Export ({$cardCount}
			{$cardCount === 1 ? 'card' : 'cards'})
		</button>
	</div>
</aside>

{#if showPreviewModal}
	<Modal title="Card Preview" bind:visible={showPreviewModal}>
		<div class="modal-body">
			<CardPreview card={previewCard} />
		</div>
	</Modal>
{/if}

<script lang="ts">
	import { fade } from 'svelte/transition';
	import JapaneseWord from '../definitions/JapaneseWord.svelte';
	import CardPreview from './CardPreview.svelte';
	import phraseStore from '../stores/phrases';
	import {
		cards,
		cardsByPhrase,
		currentPhrase,
		currentPhraseIndex,
		cardCount,
		removeCard,
		showExport,
	} from '../stores/cards';
	import { Progress, Modal, Icon } from 'sheodox-ui';
	import type { CardsByPhrase } from '../stores/cards';
	import type { Card } from '../types/cards';

	let previewCard: Card = null,
		showPreviewModal = false;

	function preview(card: Card) {
		previewCard = card;
		showPreviewModal = true;
	}

	function cardSlice(cardsByPhrase: CardsByPhrase, phrase: string) {
		return cardsByPhrase.get(phrase);
	}
</script>
