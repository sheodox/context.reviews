<style>
    aside {
        flex: 1;
        position: relative;
		border-left: var(--shdx-panel-border);
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
    li {
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
    li button {
        flex: 0;
    }
    .preview-container {
        position: absolute;
        z-index: 10000; /* show this over the top of the definitions */
		left: 0;
        top: 0;
		transform: translate(-100%);
        width: 30rem;
        border-radius: 5px;
        border: 1px solid var(--shdx-accent-purple);
        overflow: hidden;
    }
    .phrase-select {
        margin: 1rem 0;
    }
    .panel-body {
        display: flex;
        flex-direction: column;
    }
	@media (max-width: 900px) {
		/* on-hover previews not available on small resolutions, need to use the modal */
		.preview-container {
            display: none;
		}
		aside {
			border-left: none;
			border-top: var(--shdx-panel-border);
		}
	}
</style>

<aside on:mouseleave={() => previewCard = null} class="panel">
    <div class="panel-body">
		<label for="phrases-processed">
			Phrases Processed ({$currentPhraseIndex}/{$phraseStore.length})
		</label>
		<Progress value={$currentPhraseIndex} max={$phraseStore.length} id="phrases-processed"/>
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
				<li in:fade={{duration: 100}} on:mouseenter={() => previewCard = card} >
					<span class="word">
						<JapaneseWord word={card.word} reading={card.reading}/>
					</span>
					<button on:click={() => removeCard($currentPhrase, card)}>Remove</button>
				</li>
            {:else}
				<li class="no-cards">No cards for this phrase yet.</li>
            {/each}
		</ul>

        {#if previewCard}
			{#key previewCard}
				<div class="preview-container">
					<CardPreview card={previewCard} />
				</div>
            {/key}
        {/if}
		<button
			id="export-button"
			on:click={() => showExport = true}
			disabled={cards.length === 0}
		>
			Export
			({$cardCount} {$cardCount === 1 ? 'card' : 'cards'})
		</button>
	</div>
</aside>

{#if showPreviewModal}
	<Modal title="Card Preview" bind:visible={showPreviewModal}>
		<CardPreview card={previewCard} />
	</Modal>
{/if}
<script>
    import {fade} from 'svelte/transition';
    import JapaneseWord from '../definitions/JapaneseWord.svelte';
    import CardPreview from './CardPreview.svelte';
    import {createEventDispatcher} from 'svelte';
    import {get} from 'svelte/store';
    import phraseStore from '../phraseStore';
    import {
    	cards,
    	cardsByPhrase,
        currentPhrase,
        currentPhraseIndex,
        cardCount,
        removeCard
    } from './cardsStore';
    import {Progress, Modal} from 'sheodox-ui';

    export let showExport;

    const dispatch = createEventDispatcher();
    let groupedCards = [],
        previewCard = null,
		showPreviewModal = false;

    function cardSlice(cardsByPhrase, phrase) {
        return cardsByPhrase.get(phrase);
    }

    function goToPhrase(context) {
    	const phrases = get(phraseStore),
            phraseIndex = phrases.findIndex(phrase => phrase.phrase === context);

    	if (phraseIndex > -1) {
			currentPhraseIndex.set(phraseIndex);
		}
	}
</script>