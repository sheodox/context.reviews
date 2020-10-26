<style>
	#list {
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
		position: sticky;
		top: 0;
		/* keep the toolbar above the 'v' more buttons when the action buttons are collapsed */
		z-index: 11;
		border-bottom: var(--panel-border);
	}
	table {
		width: fit-content;
		margin: 0.5rem 0;
	}
	main {
		overflow: auto;
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	#list-container {
		flex: 3;
	}
	aside {
		flex: 1;
		min-width: 20rem;
		border-left: var(--panel-border);
	}

	#definitions {
		background-color: var(--panel-bg);
		width: 25%;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
	}

	#help-inline {
		display: flex;
		justify-content: center;
	}

	@media (max-width: 650px) {
		#list {
			width: 100%;
			height: auto;
		}
        #definitions {
			position: relative;
			width: 100%;
			height: auto;
			border-left: none;
            border-top: var(--panel-border);
		}
		main {
			flex-direction: column;
		}
	}
</style>

<div id="list">
	<Header>
        <nav>
			<a href="export"><Icon icon="note_add" />Anki Export</a>
		</nav>
	</Header>
	<main>
		<div id="list-container">
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
				<div class="centered-">
					{#if $hasAddedPhrases}
						<NoMorePhrases />
					{:else}
						<Help />
					{/if}
				</div>
			{:else if phrases.length > 0}
				<table>
					<thead>
					<tr>
						<th><span class="sr-only">Actions</span></th>
						<th>Phrases ({phrases.length})</th>
					</tr>
					</thead>

					<tbody>
					{#each phrases as phrase (phrase.id)}
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
		</div>
		<aside id="definitions" class="panel">
			<Definitions term={selection} />
		</aside>
	</main>

	<Footer />
</div>

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
	import NoMorePhrases from './NoMorePhrases.svelte';
	import AddPhrases from './AddPhrases.svelte';
	import {hasAddedPhrases} from "../metadataStore";

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