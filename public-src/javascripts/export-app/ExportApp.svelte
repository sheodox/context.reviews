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
						on:click={() => currentPhraseIndex.set($phraseStore.length)}
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
            {#if $phraseStore && $currentPhraseIndex < $phraseStore.length}
				<CardList cards={cards} on:goToPhrase={goToPhrase}/>
                <!-- using a keyed each for one element so it always rebuilds -->
                {#each [$phraseStore[$currentPhraseIndex]] as phrase ($phraseStore[$currentPhraseIndex].phrase) }
                    <CardBuilder phrase={phrase} on:done={nextPhrase} on:back={prevPhrase} />
                {/each}
			{:else if $phraseStore}
				<Exporter />
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
    } from './cardsStore';

	let showExport = false;

	phraseStore.subscribe(setPhrases);

	const finishedProcessing = derived([currentPhraseIndex, phraseStore], ([currentPhraseIndex, phrases]) => {
		return phrases && currentPhraseIndex === phrases.length;
	});
	finishedProcessing.subscribe(finished => {
		if (finished) {
			showExport = true;
		}
	})

	function nextPhrase() {
		currentPhraseIndex.update(phrase => phrase + 1);
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
</script>
