<style>
    .container {
        max-width: 90vw;
        margin: 0 auto;
    }
    .card-preview {
        margin: var(--shdx-spacing-3);
        font-weight: normal;
    }
    button span {
        display: block;
        font-size: var(--shdx-font-size-6);
        margin: var(--shdx-spacing-6);
        margin-top: var(--shdx-font-size-5);
    }
    button {
        font-weight: normal;
    }
    .preview {
        pointer-events: none;
        line-height: 1.4;
    }
    .skeleton {
        display: none;
    }
    @media (max-width: 900px) {
        .card-preview {
            display: none;
        }
        .skeleton {
            display: block;
        }
    }
</style>

<div class="container">
    <p class="text-align-center shdx-font-size-5">Which card front style do you prefer?</p>

    <div class="f-row justify-content-center">
        <button on:click={() => dispatch('cancel')}>Cancel</button>
    </div>

    <div class="f-row f-wrap justify-content-center align-items-start">
        <button class="card clickable" on:click={() => pick('word')}>
            <span>Dictionary form on the front</span>

            <div aria-hidden="true" class="preview">
                <div class="skeleton">
                    <StyleCard variant="word" />
                </div>
                <div class="card-preview">
                    <CardPreview card={wordCard} />
                </div>
            </div>
        </button>

        <button class="card clickable" on:click={() => pick('context')}>
            <span>Word in context on the front</span>
            <div aria-hidden="true" class="preview">
                <div class="skeleton">
                    <StyleCard variant="context" />
                </div>
                <div class="card-preview">
                    <CardPreview card={contextCard} />
                </div>
            </div>
        </button>
    </div>
</div>

<script>
    import {createEventDispatcher} from 'svelte';
    import StyleCard from './StyleCard.svelte';
    import {card} from './currentCardStore';
    import {cardStyle} from "./cardsStore";
    import CardPreview from "./CardPreview.svelte";

    const dispatch = createEventDispatcher();
    $: wordCard = {...$card, cardStyle: 'word'};
    $: contextCard = {...$card, cardStyle: 'context'};

    function pick(style) {
        $cardStyle = style;
        dispatch('done');
    }
</script>