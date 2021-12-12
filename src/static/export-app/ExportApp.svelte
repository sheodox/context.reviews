<style>
	.row {
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	#card-workspace {
		flex: 1;
		display: flex;
	}

	@media (max-width: 900px) {
		#card-workspace {
			scroll-snap-type: x mandatory;
			overflow: auto;
		}
		#card-workspace > :global(div.builder) {
			flex: 1 0 90%;
			width: 90%;
			scroll-snap-align: start;
		}
		#card-workspace > :global(aside) {
			flex: 0 0 20rem;
			scroll-snap-align: start;
		}
	}
	@media (min-width: 1200px) {
		#card-workspace :global(aside) {
			max-width: 20rem;
		}
	}
	.full-page-contents {
		flex: 1;
		display: flex;
		width: 100%;
	}
</style>

<div class="full-page-contents">
	{#if $phraseStore && $phraseStore.length === 0}
		<NoPhrases />
	{:else if $showExport}
		<Exporter on:back={() => ($showExport = false)} on:restart={startOver} />
	{:else if $phraseStore}
		<div class="row" id="card-workspace">
			<!-- using a keyed each for one element so it always rebuilds -->
			{#each [$phraseStore[$currentPhraseIndex]] as phrase ($phraseStore[$currentPhraseIndex].phrase)}
				<CardBuilder {phrase} on:done={nextPhrase} on:back={prevPhrase} />
			{/each}
			<CardList on:goToPhrase={goToPhrase} />
		</div>
	{/if}
</div>

<svelte:window on:beforeunload={beforeUnload} />

<script lang="ts">
	import phraseStore from '../stores/phrases';
	import CardBuilder from './CardBuilder.svelte';
	import Exporter from './Exporter.svelte';
	import CardList from './CardList.svelte';
	import { get } from 'svelte/store';
	import {
		setPhrases,
		currentPhraseIndex,
		cardCount,
		reset as resetCardsStores,
		downloadedDeck,
		showExport,
	} from '../stores/cards';
	import NoPhrases from './NoPhrases.svelte';

	phraseStore.subscribe(setPhrases);

	function nextPhrase() {
		const numPhrases = get(phraseStore).length;
		currentPhraseIndex.update((index) => {
			if (index + 1 < numPhrases) {
				return index + 1;
			}
			$showExport = true;
			//maintain the current index if they're hitting 'next' on the last phrase
			return index;
		});
	}

	function prevPhrase() {
		currentPhraseIndex.update((phrase) => Math.max(0, phrase - 1));
	}

	function goToPhrase(e: CustomEvent<number>) {
		currentPhraseIndex.set(e.detail);
	}

	function beforeUnload(e: BeforeUnloadEvent) {
		//try to prevent them from navigating away if they haven't downloaded the deck yet but have made cards
		//otherwise they will have to remake the whole thing if they misclicked
		if (get(cardCount) > 0 && !get(downloadedDeck)) {
			e.preventDefault();
			e.returnValue = '';
		}
	}

	function startOver() {
		resetCardsStores();
	}
</script>
