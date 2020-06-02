<style>
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	#mode-radios {
		display: flex;
		justify-content: end;
	}
	#left {
		width: 75%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	th {
		font-size: 1.1rem;
		white-space: nowrap;
	}

	h1 {
		flex: 1;
	}

	#toolbar {
		display: flex;
		flex-direction: row;
		margin: 1rem;
	}
	table {
		width: fit-content;
	}
	main {
		margin: 1rem;
		flex: 1;
	}
</style>

<div id="left">
	<div id="toolbar">
		<h1>Context.Reviews</h1>
        <div class="flex-column">
			<div class="buttons">
				<a href="export">Anki Export</a>
				<button on:click={undo}>Undo Delete</button>
				<button on:click={stop}>Stop Voice</button>
				<button on:click={showAll}>Show All</button>
				<button on:click={e => showHints = !showHints}>{showHints ? 'List' : 'Help'}</button>
			</div>
			<div id="mode-radios">
				<label>
					<input type="radio" bind:group={mode} value="review">
					Review Mode
				</label>
				<label>
					<input type="radio" bind:group={mode} value="delete">
					Delete Mode
				</label>
			</div>
		</div>
	</div>
	<main>
		{#if showHints || phrases.length === 0}
			<Help />
		{:else if visiblePhrases.length > 0}
			<table>
				<tr>
					<th>Actions</th>
					<th>Phrases ({phraseCountDetails})</th>
				</tr>

				<tbody on:mouseup={selected}>
				{#each visiblePhrases as phrase}
					<Phrase phrase={phrase} mode={mode} forceShowDelete={forceShowDelete} />
				{/each}
				</tbody>
			</table>
		{:else}
			<AllReviewed />
		{/if}

	</main>
	<Footer />
</div>

<Definitions term={selection} />

<Toasts />

<svelte:window on:keydown={keydown} on:keyup={checkModifiers} />

<script>
	import Definitions from './DictionarySearchPanel.svelte';
	import Help from "./Help.svelte";
	import Phrase from './Phrase.svelte';
	import Toasts from './Toasts.svelte';
	import {say} from '../speech'
	import AllReviewed from "./AllReviewed.svelte";
	import phraseStore from '../phraseStore';
	import Footer from '../Footer.svelte';

	let selection = '',
		showHints = false,
		phrases = [],
		useXHR = false,
		phraseCountDetails = '',
		mode = 'delete',
		forceShowDelete = false,
		visiblePhrases = [],
		numVisiblePhrases = 0;

	phraseStore.subscribe(list => {
		//phrases inits null for toasts (it's null until the list is known) so need a fallback
		phrases = list || [];
	});

	$: {
		visiblePhrases = mode !== 'review' ? phrases : phrases.filter(phrase => {
			return phrase.visible;
		});

		const numPhrases = phrases.length,
			reviewedPhrases = numPhrases - visiblePhrases.length;
		document.title = `${numPhrases} - Japanese Context Sentence Review`;
		phraseCountDetails = reviewedPhrases === 0 ? numPhrases : `${numPhrases}, ${reviewedPhrases} reviewed`
	}

	function selected(e) {
		//don't read things if they're clicking one of the phrase buttons and happen to have text selected
		if (e.target.tagName === 'BUTTON') {
			return;
		}
		const text = window.getSelection().toString();
		if (text) {
			say(text);
			selection = text;
		}
	}

	function undo() {
		phraseStore.action('undo');
	}

	function showAll() {
		phraseStore.action('show-all')
	}

	function stop() {
		speechSynthesis.cancel();
	}

	function phraseEventHandler(event) {
		console.log('event', event);
	}

	function keydown(e) {
		if (e.key === 'z' && e.ctrlKey && e.target.tagName !== 'INPUT') {
			undo();
		}
		checkModifiers(e);
	}

	function checkModifiers(e) {
		forceShowDelete = e.shiftKey;
	}
</script>