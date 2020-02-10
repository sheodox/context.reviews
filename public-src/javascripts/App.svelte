<div id="left">
	<h1>Japanese Context Sentence Review</h1>
	<div id="toolbar">
		<button on:click={undo}>← Undo</button>
		<button on:click={stop}>Stop</button>
		<button on:click={e => showHints = !showHints}>{showHints ? 'List' : 'Help'}</button>
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
					<Phrase select={phraseSelected} phrase={phrase} on:updateList={e => phrases = e.detail.list} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<Definitions term={selection} />

<style>
	#left {
		width: 75%;
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


	socket.on('refresh', list => {
		phrases = list;
	});
	socket.on('connect_error', () => {
		useXHR = true;
	});

	action('list');

	function selected() {
		const text = window.getSelection().toString();
		if (text) {
			selection = text;
		}
	}

	function phraseSelected(phrase) {
		say(phrase);
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
</script>