<style>
    ruby {
        font-weight: normal;
    }
    .exact-match {
        color: var(--primary-light);
        font-weight: bold;
    }
    .partial-match {
        color: var(--primary);
    }
    :global(button:disabled) .exact-match, :global(button:disabled) .partial-match {
        color: var(--muted);
    }
    @keyframes furigana-grow-delayed {
        100% {
            font-size: 2rem;
        }
	}
    ruby:hover {
        animation: furigana-grow-delayed 0.25s forwards;
        animation-delay: 1s;
    }
</style>

<ruby>
    {#if word === wordComparison}
        <span class="exact-match">{word}</span>
    {:else}
        <span class="partial-match">{wordHighlighted}</span><span>{wordNormal}</span>
    {/if}

    {#if word !== reading && reading}
		<rp>(</rp>
		<rt>
            {#if reading === readingComparison}
                <span class="exact-match">{reading}</span>
            {:else}
                <span class="partial-match">{readingHighlighted}</span>{readingNormal}
            {/if}
        </rt>
		<rp>)</rp>
    {/if}
</ruby>

<script>
    export let word;
    export let reading;
    export let wordComparison = '';
    export let readingComparison = '';

    function highlightSplit(text='', comparison='') {
        let highlightCharacters = text.split('').findIndex((character, index) => {
            return comparison[index] !== character;
        });
        if (highlightCharacters === -1) {
            highlightCharacters = text.length;
        }

        return [
            text.substr(0, highlightCharacters),
            text.substr(highlightCharacters)
        ];
    }
    const [wordHighlighted, wordNormal] = highlightSplit(word, wordComparison),
        [readingHighlighted, readingNormal] = highlightSplit(reading, readingComparison);
</script>