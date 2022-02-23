<style lang="scss">
	aside {
		flex: 1;
		position: relative;
		border-left: var(--shdx-panel-border);
		min-width: 20rem;
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
		font-style: italic;
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
	fieldset {
		border-radius: 5px;
		border-color: var(--shdx-gray-200);
	}
	#export-button {
		background-color: var(--shdx-gray-400);

		&:hover {
			background-color: var(--shdx-gray-300);
		}
		&:disabled {
			background-color: transparent;
		}
	}
	@media (max-width: 900px) {
		aside {
			border-left: none;
			border-top: var(--shdx-panel-border);
		}
	}
</style>

<aside class="panel">
	<div class="m-3 gap-3 f-column">
		<fieldset class="f-column gap-3">
			<legend>Phrases</legend>

			<label for="phrases-processed" class="fw-bold">
				Phrase {$currentPhraseIndex + 1} of {$phraseStore.length}
			</label>
			<Progress value={$currentPhraseIndex + 1} max={$phraseStore.length} id="phrases-processed" />

			<div class="phrase-select">
				<label>
					<span class="fw-bold"> Skip To Phrase </span>
					<select bind:value={$currentPhraseIndex} class="jp">
						{#each Array.from($cardsByPhrase) as [phrase], index}
							<option value={index}>{phrase}</option>
						{/each}
					</select>
				</label>
			</div>
		</fieldset>

		<fieldset>
			<legend>Cards From This Phrase </legend>
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
					<li class="no-cards py-3">No cards yet.</li>
				{/each}
			</ul>
		</fieldset>

		<fieldset class="f-column">
			<legend>All Cards</legend>
			<button id="export-button" on:click={() => ($showExport = true)} disabled={$cards.length === 0}>
				{$exportText}
			</button>
			<ul>
				{#each $cards as card}
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
					<li class="no-cards py-3">No cards yet.</li>
				{/each}
			</ul>
		</fieldset>
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
		removeCard,
		showExport,
		exportText,
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
