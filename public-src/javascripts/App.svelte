<div id="left">
	<div id="toolbar">
		<h1>Japanese Context Sentence Review</h1>
		<div class="buttons">
			<button on:click={undo}>← Undo</button>
			<button on:click={stop}>Stop</button>
			<button on:click={e => showHints = !showHints}>{showHints ? 'List' : 'Help'}</button>
		</div>
	</div>
	{#if showHints || phrases.length === 0}
		<Help />
	{:else}
    	<table>
            <tr>
				<th>Actions</th>
				<th>Phrases ({phrases.length})</th>
			</tr>

            <tbody on:mouseup={selected}>
				{#each phrases as phrase}
					<Phrase phrase={phrase} on:updateList={e => phrases = e.detail.list} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<Definitions term={selection} />

<svelte:window on:keydown={keydown} />

<style>
	#left {
		width: 75%;
	}
	th {
		font-size: 1.1rem;
	}

	h1 {
		flex: 1;
	}

	#toolbar {
		margin-bottom: 2rem;
        display: flex;
		flex-direction: row;
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

	$: {
		document.title = `${phrases.length} - Japanese Context Sentence Review`;
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