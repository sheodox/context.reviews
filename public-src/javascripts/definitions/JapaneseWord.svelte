<style>
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
    {word}
    {#if word !== reading && reading}
		<rp>(</rp>
		<rt>{reading}</rt>
		<rp>)</rp>
    {/if}
</ruby>

<script>
    export let word;
    export let reading;
</script>