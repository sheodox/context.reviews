<div id="left">
	<div id="toolbar">
		<h1>Japanese Context Sentence Review</h1>
        <div class="flex-column">
			<div class="buttons">
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
					<Phrase phrase={phrase} on:updateList={e => phrases = e.detail.list} mode={mode} forceShowDelete={forceShowDelete} />
				{/each}
			</tbody>
		</table>
	{:else}
        <AllReviewed />
	{/if}
</div>

<Definitions term={selection} />

<svelte:window on:keydown={keydown} on:keyup={checkModifiers} />

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
	}
	th {
		font-size: 1.1rem;
		white-space: nowrap;
	}

	h1 {
		flex: 1;
	}

	#toolbar {
		margin-bottom: 2rem;
        display: flex;
		flex-direction: row;
	}
	table {
		width: fit-content;
	}
</style>

<script>
	import Definitions from './Definitions.svelte';
	import Help from "./Help.svelte";
	import Phrase from './Phrase.svelte';
	import {say} from './speech'
	import AllReviewed from "./AllReviewed.svelte";

	const socket = io({
		pathname: location.pathname + 'socket.io/socket.io',
		reconnectionAttempts: 1
	});

	const action = url => fetch(url).then(res => res.json()).then(updateList);
	let selection = '',
		showHints = false,
		phrases = [],
		useXHR = false,
		phraseCountDetails = '',
		mode = 'review',
		forceShowDelete = false,
		visiblePhrases = [],
		numVisiblePhrases = 0;

	$: {
		visiblePhrases = mode !== 'review' ? phrases : phrases.filter(phrase => {
			return phrase.visible;
		});

		const numPhrases = phrases.length,
			reviewedPhrases = numPhrases - visiblePhrases.length;
		document.title = `${numPhrases} - Japanese Context Sentence Review`;
		phraseCountDetails = reviewedPhrases === 0 ? numPhrases : `${numPhrases}, ${reviewedPhrases} reviewed`
	}

	socket.on('refresh', list => {
		phrases = list;
	});
	socket.on('connect_error', () => {
		if (useXHR) {
			return;
		}

		useXHR = true;
		setInterval(() => {
			action('list');
		}, 10 * 1000);
	});

	action('list');

	function selected() {
		const text = window.getSelection().toString();
		if (text) {
			say(text);
			selection = text;
		}
	}

	async function undo() {
		if (useXHR) {
			action('undo');
		} else {
			socket.emit('undo');
		}
	}

	async function showAll() {
		action('show-all')
	}

	function updateList(list) {
		phrases = list;
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