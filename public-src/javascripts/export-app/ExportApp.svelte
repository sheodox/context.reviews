<style>
    .row {
        display: flex;
        flex-direction: row;
		flex: 1;
    }
	.container {
        display: flex;
        flex-direction: column;
        align-items: center;
		width: 100%;
    }

	#card-workspace {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	@media (max-width: 1200px) {
		#card-workspace {
			flex-direction: column;
			justify-content: start;
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

<div class="row">
    <div class="container">
        <Header pageName="Anki Export">
			<nav>
				<ul>
					<li>
						<a href="/"><Icon icon="angle-left" />Back To Phrase List</a>
					</li>
					<li>
						<UserMenu />
					</li>
				</ul>
			</nav>
		</Header>

		<div class="full-page-contents">
			{#if $phraseStore && $phraseStore.length === 0}
				<NoPhrases />
			{:else}
				{#if showExport}
					<Exporter
						on:back={() => showExport = false}
						on:restart={startOver}
					/>
				{:else if $phraseStore}
					<div class="row" id="card-workspace">
						<!-- using a keyed each for one element so it always rebuilds -->
						{#each [$phraseStore[$currentPhraseIndex]] as phrase ($phraseStore[$currentPhraseIndex].phrase) }
							<CardBuilder phrase={phrase} on:done={nextPhrase} on:back={prevPhrase} />
						{/each}
						<CardList cards={cards} on:goToPhrase={goToPhrase} bind:showExport />
					</div>
				{/if}
			{/if}
		</div>
		<Footer />
	</div>
</div>

<svelte:window on:beforeunload={beforeUnload} />
<script>
	import {derived} from 'svelte/store';
	import phraseStore from '../phraseStore';
	import CardBuilder from './CardBuilder.svelte';
	import Header from '../Header.svelte';
	import Exporter from "./Exporter.svelte";
	import {Icon, Modal} from 'sheodox-ui';
	import CardList from './CardList.svelte';
	import Footer from '../Footer.svelte';
	import {get} from 'svelte/store';
	import {
		setPhrases,
		cardsByPhrase,
		cards,
		currentPhraseIndex,
		cardCount,
		usedPhrases,
		reset as resetCardsStores,
		downloadedDeck
	} from './cardsStore';
	import NoPhrases from "./NoPhrases.svelte";
	import UserMenu from "../UserMenu.svelte";

	phraseStore.subscribe(setPhrases);
	let showExport = false;

	function nextPhrase() {
		const numPhrases = get(phraseStore).length;
		currentPhraseIndex.update(index => {
			if (index + 1 < numPhrases) {
				return index + 1;
			}
			showExport = true;
			//maintain the current index if they're hitting 'next' on the last phrase
			return index;
		});
	}

	function prevPhrase() {
		currentPhraseIndex.update(phrase => Math.max(0, phrase - 1));
	}

	function goToPhrase(e) {
		currentPhraseIndex.set(e.detail);
	}

	function beforeUnload(e) {
		//try to prevent them from navigating away if they haven't downloaded the deck yet but have made cards
		//otherwise they will have to remake the whole thing if they misclicked
		if (get(cardCount) > 0 && !get(downloadedDeck)) {
			e.preventDefault();
			e.returnValue = '';
		}
	}

	function startOver() {
		resetCardsStores()
		showExport = false;
	}
</script>
