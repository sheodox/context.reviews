<style>
	ruby {
		font-weight: normal;
	}
	.exact-match {
		color: var(--sx-primary-light);
		font-weight: bold;
	}
	.partial-match {
		color: var(--sx-primary);
	}
	:global(button:disabled) .exact-match,
	:global(button:disabled) .partial-match {
		color: var(--sx-muted);
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
			<span class="partial-match">{readingHighlighted}</span>{readingNormal}
		</rt>
		<rp>)</rp>
	{/if}
</ruby>

<script lang="ts">
	export let word: string;
	export let reading: string;
	export let wordComparison = '';

	function highlightSplit(text = '', comparison = '') {
		let highlightCharacters = text.split('').findIndex((character, index) => {
			return comparison[index] !== character;
		});
		if (highlightCharacters === -1) {
			highlightCharacters = text.length;
		}

		return [text.substring(0, highlightCharacters), text.substring(highlightCharacters)];
	}
	$: [wordHighlighted, wordNormal] = highlightSplit(word, wordComparison);
	$: [readingHighlighted, readingNormal] = highlightSplit(reading, wordComparison);
</script>
