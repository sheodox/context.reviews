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
		background: #2a3450;
        width: 100vw;
    }
    header > .row {
        max-width: 950px;
        justify-content: space-between;
        margin: 0 auto;
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
                <h1> SRS Exporter </h1>

                {#if phrases}
                    <div class="row">
						<a href="/">Back to review list</a>
						<CardWizard processedPhrases={processed} totalPhrases={phrases.length} />
                        <button
                            id="export-button"
                            class:primary={processed === phrases.length}
                            on:click={exportCards}
                            disabled={numCards === 0}
                        >
                            Export
                            <br>
                            ({numCards} {numCards === 1 ? 'card' : 'cards'})
                        </button>
                    </div>
                {/if}
			</div>
			<div class="header-line"></div>
		</header>

        {#if phrases && processed < phrases.length}
            <!-- using a keyed each for one element so it always rebuilds -->
            {#each [phrases[processed]] as phrase (phrases[processed]) }
                <CardBuilder phrase={phrase} on:cards={addCards}/>
            {/each}
        {:else if phrases}
            <AllProcessed
                numPhrases={phrases.length}
                numCards={numCards}
                consumedPhrases={consumedPhrases}
                exportClicked={exportClicked}
            />
        {/if}
    </div>
</div>

<svelte:window on:beforeunload={beforeUnload} />
<script>
	import SRSConstructor from './SRSConstructor';
	import phraseStore from '../phraseStore';
	import CardWizard from './CardWizard.svelte';
	import CardBuilder from './CardBuilder.svelte';
	import AllProcessed from "./AllProcessed.svelte";

	const srs = new SRSConstructor();
	let phrases,
		processed = 0,
		numCards = 0,
        exportClicked = false,
        consumedPhrases = new Set();

	phraseStore.subscribe((list) => {
		phrases = list;
	});

	function addCards(e) {
		const cards = e.detail;
		if (cards.length) {
			srs.addCards(e.detail);
			numCards += e.detail.length;
			cards.forEach(card => {
				consumedPhrases.add(card.context);
			})
		}
		processed++;
	}

	function exportCards() {
		srs.export();
		//give them a button to delete used phrases, but not until they've tried to download the exported phrases
		exportClicked = true;
	}

	function beforeUnload(e) {
		if (numCards > 0) {
			e.preventDefault();
            e.returnValue = '';
        }
    }
</script>
