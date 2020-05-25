<style>
    aside {
        max-width: 30rem;
        align-self: flex-start;
        background: var(--panel-bg);
        padding: 1rem;
        margin: 1rem;
        flex: 1;
        position: relative;
    }
    h2 {
        background: var(--panel-header-bg);
        padding: 1rem;
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
        left: 100%;
        top: 0;
        width: 30rem;
        border-radius: 5px;
        border: 1px solid white;
        overflow: hidden;
    }
</style>

<aside in:fly={{y: 50, duration: 100}} on:mouseleave={() => previewCard = null}>
    <h2>Created Cards</h2>
    <label>
        Skip To Phrase
        <select bind:value={$currentPhraseIndex}>
            {#each Array.from($cardsByPhrase) as [phrase], index}
                <option value={index}>{phrase}</option>
            {/each}
        </select>
    </label>
	<hr>
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
        {#each [previewCard] as preview (preview)}
            <div class="preview-container">
				<CardPreview card={preview} />
            </div>
        {/each}
    {/if}
</aside>

<script>
    import {fade, fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';
    import JapaneseWord from '../definitions/JapaneseWord.svelte';
    import CardPreview from './CardPreview.svelte';
    import {createEventDispatcher} from 'svelte';
    import {get} from 'svelte/store';
    import phraseStore from '../phraseStore';
    import {
    	cardsByPhrase,
        currentPhrase,
        currentPhraseIndex,
        cardCount,
        removeCard
    } from './cardsStore';

    const dispatch = createEventDispatcher();
    let groupedCards = [],
        previewCard = null;

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