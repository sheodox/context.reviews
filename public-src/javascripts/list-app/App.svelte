<style>
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
			<button on:click={stop} disabled={!speaking}><Icon icon="stop" />Stop Voice</button>
			<button on:click={() => showAdd = true}><Icon icon="add" />Add Phrases</button>
			<button on:click={e => showHelp = true}><Icon icon="help" />Help</button>
		</div>
		{#if initiallyLoading}
			<!-- show nothing when doing the initial list load, because if
			a loading indicator is shown for a super short time it'll be kind of jarring -->
		{:else if phrases.length === 0}
			<Help />
		{:else if phrases.length > 0}
			<table class="panel">
				<thead>
					<tr>
						<th>Actions</th>
						<th>Phrases ({phrases.length})</th>
					</tr>
				</thead>

				<tbody>
					{#each phrases as phrase}
						<Phrase phrase={phrase} on:text-select={selected} />
					{/each}
				</tbody>
			</table>
		{/if}

		{#if showHelp}
			<Modal title="Help" bind:visible={showHelp}>
				<Help />
			</Modal>
		{/if}

		{#if showAdd}
			<Modal title="Add Phrases" bind:visible={showAdd}>
				<AddPhrases bind:showAddDialog={showAdd} />
			</Modal>
		{/if}
	</main>

	<Footer />
</div>

<aside id="definitions" class="panel">
	<Definitions term={selection} />
</aside>

<Toasts />

<svelte:window on:keydown={keydown} />

<script>
	import Definitions from './DictionarySearchPanel.svelte';
	import Help from "./Help.svelte";
	import Phrase from './Phrase.svelte';
	import Toasts from './Toasts.svelte';
	import Icon from '../Icon.svelte';
	import {say} from '../speech'
	import phraseStore from '../phraseStore';
	import Footer from '../Footer.svelte';
	import Header from '../Header.svelte';
	import Modal from '../Modal.svelte';
	import AddPhrases from './AddPhrases.svelte';

	let selection = '',
		initiallyLoading = true,
		showAdd = false,
		showHelp = false,
		phrases = [],
		speaking = false;

	phraseStore.subscribe(list => {
		//phrases inits null for toasts (it's null until the list is known) so need a fallback
		phrases = list || [];
		if (list) {
			initiallyLoading = false;
		}
	});

	$: {
		document.title = `${phrases.length} - Context.Reviews`;
	}

	function selected(e) {
		const text = e.detail
		say(text);
		selection = text;
	}

	function undo() {
		phraseStore.action('undo');
	}

	function stop() {
		speechSynthesis.cancel();
	}

	function keydown(e) {
		if (e.key === 'z' && e.ctrlKey && e.target.tagName !== 'INPUT') {
			undo();
		}
	}

	function eachFrame() {
		speaking = window.speechSynthesis.speaking;
		requestAnimationFrame(eachFrame);
	}

	eachFrame();
</script>