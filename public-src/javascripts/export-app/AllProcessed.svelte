<style>
	.big {
		font-size: 2rem;
	}
	p {
		margin: 0.5rem;
		text-align: center;
		max-width: 500px;
	}
</style>

<h1 class="big">All phrases have been processed!</h1>

<p>{numCards} {numCards === 1 ? 'card has' : 'cards have'} been created from {numPhrases} {numPhrases === 1 ? 'phrase' : 'phrases'}.</p>
<p>Time to export! Click the export button in the header and import the cards into an Anki deck.</p>

{#if consumedPhrases.size}
	<button
		on:click={deleteConsumed}
		disabled={!exportClicked}
		title={!exportClicked ? 'not available until the anki export is downloaded' : ''}
	>
		Delete {consumedPhrases.size} exported context {consumedPhrases.size === 1 ? 'sentence' : 'sentences'}
	</button>
{/if}

<h2>
	Careful when importing!
</h2>
<p>
	When importing the cards ensure "Allow HTML in Fields" is checked, and "Fields separated by" says semicolon (if it doesn't, just click the button and enter a semicolon).
</p>

<p>You should only see two fields in the field mapping, Field 1 should be mapped to Front, field 2 should be mapped to Back, this is the default assuming the field separator is semicolon. If you see a bunch of fields double check the field separator.</p>

<script>
    import {get} from 'svelte/store';
	import phraseStore from '../phraseStore';
	export let numPhrases = 0;
	export let numCards = 0;
	export let consumedPhrases = new Set();
	// don't offer to delete used phrases until they've actually tried to download the exported phrases
	export let exportClicked = false;


	async function deleteConsumed() {
		const phrases = get(phraseStore);
		//find the phrase IDs from each phrase
		consumedPhrases.forEach(contextSentence => {
			const phrase = phrases.find(({phrase}) => {
				return phrase === contextSentence
			})
			if (phrase) {
				phraseStore.action(`remove/${phrase.id}`)
			}
		})
		consumedPhrases.clear();
	}
</script>
