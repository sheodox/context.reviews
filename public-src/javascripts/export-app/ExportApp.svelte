<style>
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
	.container {
        display: flex;
        flex-direction: column;
        align-items: center;
		width: 100%;
    }
	.header-toolbar > * {
		margin: 0 1rem;
        align-content: baseline;
		align-items: end;
	}

	#card-workspace {
		flex: 1;
		display: flex;
		width: 95vw;
		max-width: 90rem;
		justify-content: center;
	}
	.max-height {
		height: 100%;
	}
</style>

<div class="row max-height">
    <div class="container max-height">
        <Header pageName="Anki Export">
            {#if $phraseStore}
				<div class="row header-toolbar">
					<nav>
						<a href="/"><Icon icon="list" />Back to review list</a>
					</nav>
					<button
						id="export-button"
						on:click={() => showExport = true}
						disabled={cards.length === 0}
					>
						Export
						<br>
						({$cardCount} {$cardCount === 1 ? 'card' : 'cards'})
					</button>
				</div>
            {/if}
		</Header>

		<div class="row" id="card-workspace">
			{#if showExport}
				<Exporter
					on:back={() => showExport = false}
					on:restart={startOver}
				/>
            {:else if $phraseStore}
				<CardList cards={cards} on:goToPhrase={goToPhrase}/>
                <!-- using a keyed each for one element so it always rebuilds -->
                {#each [$phraseStore[$currentPhraseIndex]] as phrase ($phraseStore[$currentPhraseIndex].phrase) }
                    <CardBuilder phrase={phrase} on:done={nextPhrase} on:back={prevPhrase} />
                {/each}
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
	import Icon from '../Icon.svelte';
	import Exporter from "./Exporter.svelte";
	import Modal from '../Modal.svelte';
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
		reset as resetCardsStores
    } from './cardsStore';

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
		if (get(cardCount) > 0) {
			e.preventDefault();
            e.returnValue = '';
        }
    }

    function startOver() {
		resetCardsStores()
		showExport = false;
	}
</script>
