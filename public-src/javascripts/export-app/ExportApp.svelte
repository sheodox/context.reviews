<style>
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .centered {
		justify-content: center;
	}
	.container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    header {
		background: var(--panel-header-bg);
        width: 100vw;
    }
    header > .row {
        max-width: 950px;
        justify-content: space-between;
        margin: 0 auto;
    }
    h1 {
        margin: 0;
    }
    header a {
        margin: 1rem;
    }
    div.header-line {
        width: 100%;
        height: 2px;
        background: var(--accent-gradient);
    }
</style>

<div class="row">
    <div class="container">
        <header>
            <div class="row centered">
                <h1>Anki Export - Context.Reviews</h1>

                {#if $phraseStore}
                    <div class="row">
						<a href="/">Back to review list</a>
						<CardWizard processedPhrases={$currentPhraseIndex} totalPhrases={$phraseStore.length} />
                        <button
                            id="export-button"
                            class:primary={$currentPhraseIndex === $phraseStore.length}
                            on:click={exportCards}
                            disabled={cards.length === 0}
                        >
                            Export
                            <br>
                            ({$cardCount} {$cardCount === 1 ? 'card' : 'cards'})
                        </button>
                    </div>
                {/if}
			</div>
			<div class="header-line"></div>
		</header>

        <div class="row">
            {#if $phraseStore && $currentPhraseIndex < $phraseStore.length}
                <CardList cards={cards} on:goToPhrase={goToPhrase}/>
                <!-- using a keyed each for one element so it always rebuilds -->
                {#each [$phraseStore[$currentPhraseIndex]] as phrase ($phraseStore[$currentPhraseIndex].phrase) }
                    <CardBuilder phrase={phrase} on:done={nextPhrase} on:back={prevPhrase} />
                {/each}
            {:else if $phraseStore}
                <AllProcessed
                    numPhrases={$usedPhrases.length}
                    numCards={$cardCount}
                    consumedPhrases={$usedPhrases}
                    exportClicked={exportClicked}
                />
            {/if}
		</div>
    </div>
</div>

<svelte:window on:beforeunload={beforeUnload} />
<script>
	import SRSConstructor from './SRSConstructor';
	import phraseStore from '../phraseStore';
	import CardWizard from './CardWizard.svelte';
	import CardBuilder from './CardBuilder.svelte';
	import AllProcessed from "./AllProcessed.svelte";
	import CardList from './CardList.svelte';
	import {get} from 'svelte/store';
	import {
		setPhrases,
        cardsByPhrase,
        cards,
        currentPhraseIndex,
        cardCount,
        usedPhrases,
    } from './cardsStore';

	let exportClicked = false;

	phraseStore.subscribe(setPhrases);

	function nextPhrase() {
		currentPhraseIndex.update(phrase => phrase + 1);
	}

	function prevPhrase() {
		currentPhraseIndex.update(phrase => Math.max(0, phrase - 1));
	}

	function goToPhrase(e) {
        currentPhraseIndex.set(e.detail);
    }

	function exportCards() {
		const srs = new SRSConstructor();
        srs.addCards(get(cards));
		srs.export();
		//give them a button to delete used phrases, but not until they've tried to download the exported phrases
		exportClicked = true;
	}

	function beforeUnload(e) {
		if (get(cardCount) > 0) {
			e.preventDefault();
            e.returnValue = '';
        }
    }
</script>
