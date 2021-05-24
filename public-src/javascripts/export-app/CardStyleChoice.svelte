<style>
    .container {
        max-width: 90vw;
        margin: 0 auto;
    }
</style>

<div class="container">
    <p class="text-align-center shdx-font-size-5">Which card front style do you prefer?</p>

    <button class="card clickable" on:click={() => pick('word')}>
        Dictionary form on the front
        <StyleCard variant="word" />
    </button>

    <button class="card clickable" on:click={() => pick('context')}>
        Word in context on the front
        <StyleCard variant="context" />
    </button>

</div>

<script>
    import {createEventDispatcher} from 'svelte';
    import StyleCard from './StyleCard.svelte';
    import {cardStyle} from "./cardsStore";
    const dispatch = createEventDispatcher();

    function pick(style) {
        $cardStyle = style;
        dispatch('done');
    }
</script>