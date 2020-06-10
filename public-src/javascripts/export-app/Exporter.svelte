<style>
	p {
		margin: 0.5rem;
		text-align: center;
	}
	div {
		text-align: center;
	}
	.panel {
		padding: 1rem;
		border-radius: 0.2rem;
		display: flex;
		flex-direction: column;
	}
	.header {
		padding: 1rem;
		display: flex;
		flex-direction: row;
	}
    h1 {
		text-align: left;
		margin: 0;
		flex: 1;
	}
	button {
		align-self: center;
	}
	.panel {
		align-self: start;
		margin: 1rem;
	}
</style>

<div class="panel">
	<div class="header">
		<h1>Export</h1>
		<button
			on:click={() => currentPhraseIndex.set($phraseStore.length - 1)}
		><Icon icon="arrow_back_ios" />Back</button>
	</div>

	{#if numCards > 0}
		<p>
			Time to export!
            You created {numCards} {numCards === 1 ? 'card' : 'cards'} from {numPhrases} {numPhrases === 1 ? 'phrase' : 'phrases'}.
		</p>
		<button
			class="galaxy"
			on:click={exportCards}
		>
			<Icon icon="get_app" />Download Deck
		</button>
		{#if !phrasesDeleted}
			<button
					on:click={deleteConsumed}
					disabled={!exportClicked}
					class="danger"
					title={!exportClicked ? 'not available until the anki export is downloaded' : ''}
			>
				<Icon icon="delete" />
				Delete the {numPhrases} used context {numPhrases === 1 ? 'sentence' : 'sentences'}
			</button>
		{/if}
		{#if deleting}
			{#await deleting}
				<Loading />
			{:catch error}
				<p>An error occurred deleting phrases!</p>
			{/await}
		{/if}
		<h2>
			How to import
		</h2>
		<ol>
			<li>Select a deck in Anki, then hit "File" → "Import..."</li>
			<li>Ensure "Allow HTML in Fields" is checked, and "Fields separated by" is set to semicolon.</li>
			<li>Field mapping should be <strong>Field 1: Front, Field 2: Back.</strong> This will probably be the default.</li>
		</ol>
	{:else}
		<p>You didn't create any cards!</p>
		<button class="primary" on:click={() => currentPhraseIndex.set(0)}>Start Over</button>
	{/if}
</div>

<script>
	import {get} from 'svelte/store';
	import phraseStore from '../phraseStore';
	import {
		cardCount,
		usedPhrases,
		currentPhraseIndex,
		cards
	} from './cardsStore';
	import Loading from "../Loading.svelte";
	import Icon from '../Icon.svelte';
	import SRSConstructor from './SRSConstructor';

	let phrasesDeleted = false,
		// don't offer to delete used phrases until they've actually tried to download the exported phrases
		exportClicked = false,
		deleting;
	const numCards = get(cardCount),
		consumedPhrases = get(usedPhrases),
		numPhrases = consumedPhrases.length;

	function exportCards() {
		const srs = new SRSConstructor();
		srs.addCards(get(cards));
		srs.export();
		//give them a button to delete used phrases, but not until they've tried to download the exported phrases
		exportClicked = true;
	}

	async function deleteConsumed() {
		const phrases = get(phraseStore);
		//find the phrase IDs from each phrase
		const ids = consumedPhrases.map(contextSentence => {
			const phrase = phrases.find(({phrase}) => {
				return phrase === contextSentence
			})
			if (phrase) {
				return phrase.phrase_id;
			}
		});
		deleting = phraseStore.remove(ids);
		deleting.then(() => {
			phrasesDeleted = true;
		});
	}
</script>
