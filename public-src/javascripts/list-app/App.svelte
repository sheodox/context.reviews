<style>
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

	#toolbar {
		display: flex;
		flex-direction: row;
        align-items: center;
		justify-content: center;
	}
	table {
		width: fit-content;
		margin: 1rem;
	}
	main {
		margin: 1rem;
		flex: 1;
	}
	.panel {
		border-radius: 0.2rem;
	}

	aside {
		flex: 0;
	}

	#definitions {
		background-color: var(--panel-bg);
		position: fixed;
		width: 25%;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 650px) {
		#left {
			width: 100%;
			height: auto;
		}
        #definitions {
			position: relative;
			width: 100%;
			height: auto;
		}
	}
</style>

<div id="left">
	<Header>
        <nav>
			<a href="export"><Icon icon="note_add" />Anki Export</a>
		</nav>
	</Header>
	<main>
		<div class="panel" id="toolbar">
			<button on:click={undo}><Icon icon="undo" />Undo Delete</button>
			<button on:click={stop}><Icon icon="stop" />Stop Voice</button>
			{#if mode === 'review'}
				<button on:click={showAll}><Icon icon="visibility" />Show All</button>
			{/if}
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
			<button on:click={e => showHints = !showHints}>{showHints ? 'List' : 'Help'}</button>
		</div>
		{#if showHints || phrases.length === 0}
			<Help />
		{:else if visiblePhrases.length > 0}
			<table class="panel">
				<thead>
					<tr>
						<th>Actions</th>
						<th>Phrases ({phraseCountDetails})</th>
					</tr>
				</thead>

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

</div>

<aside id="definitions" class="panel">
	<Definitions term={selection} />
</aside>

<Footer />

<Toasts />

<svelte:window on:keydown={keydown} on:keyup={checkModifiers} />

<script>
	import Definitions from './DictionarySearchPanel.svelte';
	import Help from "./Help.svelte";
	import Phrase from './Phrase.svelte';
	import Toasts from './Toasts.svelte';
	import Icon from '../Icon.svelte';
	import {say} from '../speech'
	import AllReviewed from "./AllReviewed.svelte";
	import phraseStore from '../phraseStore';
	import Footer from '../Footer.svelte';
	import Header from '../Header.svelte';

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