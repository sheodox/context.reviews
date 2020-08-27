<style>
	p {
		margin: 0.5rem;
		text-align: center;
	}
	div {
		text-align: center;
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
	button, a[download] {
		align-self: center;
	}
	.container {
		align-self: start;
		width: 30rem;
		max-width: 95vw;
		margin: 1rem auto;
	}
</style>

<div class="container">
	<div class="header">
		<h1>Export</h1>
		{#if phrasesDeleted}
			<button
				on:click={() => dispatch('restart')}
			><Icon icon="arrow_back_ios" />Start Over</button>
		{:else}
			<button
				on:click={() => dispatch('back')}
			><Icon icon="arrow_back_ios" />Back</button>
		{/if}
	</div>

	<div class="panel-body">
		{#if numCards > 0}
			<p>
				Time to export!
				You created {numCards} {numCards === 1 ? 'card' : 'cards'} from {numPhrases} {numPhrases === 1 ? 'phrase' : 'phrases'}.
			</p>
			<a
					class="button galaxy"
					href={exported.href}
					on:click={enableDelete}
					on:contextmenu={() => enableDelete(2000)}
					download={exported.fileName}
			>
				<Icon icon="get_app" />Download Deck
			</a>
			{#if !phrasesDeleted}
				<br>
				<button
						on:click={deleteConsumed}
						disabled={!$downloadedDeck}
						class="danger"
						title={!$downloadedDeck ? 'not available until the anki export is downloaded' : ''}
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
			<div class="panel">
				<h2>
					How to import
				</h2>
				<ol>
					<li>Select a deck in Anki, then hit "File" → "Import..."</li>
					<li>Ensure "Allow HTML in Fields" is checked, and "Fields separated by" is set to semicolon.</li>
					<li>Field mapping should be <strong>Field 1: Front, Field 2: Back.</strong> This will probably be the default.</li>
				</ol>
			</div>

			{#if $cards.length}
				<p>
					You created cards for:
					<span class="jp">{getWordsFromCards($cards)}</span>
				</p>
			{/if}
		{:else}
			<p>You didn't create any cards!</p>
			<button on:click={() => dispatch('restart')}>Start Over</button>
		{/if}
	</div>
</div>

<script>
	import {createEventDispatcher} from 'svelte';
	import {get} from 'svelte/store';
	import phraseStore from '../phraseStore';
	import {
		cardCount,
		usedPhrases,
		currentPhraseIndex,
		cards,
		downloadedDeck
	} from './cardsStore';
	import Loading from "../Loading.svelte";
	import Icon from '../Icon.svelte';
	import SRSConstructor from './SRSConstructor';

	let phrasesDeleted = false,
		deleting;
	const dispatch = createEventDispatcher(),
		srs = new SRSConstructor(),
		numCards = get(cardCount),
		consumedPhrases = get(usedPhrases),
		numPhrases = consumedPhrases.length;
	srs.addCards(get(cards));
	const exported = srs.export();

	function getWordsFromCards(cards) {
		return cards.map(({word}) => word).join(', ') + '.';
	}

	function enableDelete(delay=0) {
		//to prevent the user from deleting the phrases they used and forgetting to download the deck, we don't enable
		//the button until they've interacted with the download link. this is called from a timer on right click because it's
		//assumed they're trying to hit "Save Link As..." and that just takes a bit longer
		setTimeout(() => {
			downloadedDeck.set(true);
		}, delay)
	}

	async function deleteConsumed() {
		const phrases = get(phraseStore);
		//find the phrase IDs from each phrase
		const ids = consumedPhrases.map(contextSentence => {
			const phrase = phrases.find(({phrase}) => {
				return phrase === contextSentence
			})
			if (phrase) {
				return phrase.id;
			}
		});
		deleting = phraseStore.remove(ids);
		deleting.then(() => {
			phrasesDeleted = true;
		});
	}
</script>
