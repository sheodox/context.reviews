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
	{:else}
		<table>
			<tr>
				<th>Actions</th>
				<th>Phrases ({mode === 'review' ? phraseCountDetails : phrases.length})</th>
			</tr>

            <tbody on:mouseup={selected}>
				{#each phrases as phrase}
					<Phrase phrase={phrase} on:updateList={e => phrases = e.detail.list} mode={mode} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<Definitions term={selection} />

<svelte:window on:keydown={keydown} />

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

	const socket = io({
		pathname: location.pathname + 'socket.io/socket.io',
		reconnectionAttempts: 1
	});

	const action = url => fetch(url).then(res => res.json()).then(updateList);
	let selection = '';
	let showHints = false;
	let phrases = [];
	let useXHR = false;
	let phraseCountDetails = '';
	let mode = 'review';

	$: {
		const hiddenPhrases = phrases.reduce((count, phrase) => {
			return count + (phrase.visible ? 0 : 1)
		}, 0);
		document.title = `${phrases.length} - Japanese Context Sentence Review`;
		phraseCountDetails = hiddenPhrases === 0 ? phrases.length : `${phrases.length}, ${hiddenPhrases} hidden`
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
		}
		else {
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
	}
</script>