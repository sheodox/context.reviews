<style>
	#list {
		display: flex;
		flex-direction: column;
		flex: 1;
		max-height: 100vh;
	}
	th {
		font-size: 1.1rem;
		white-space: nowrap;
		background: none;
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
	}

	#definitions {
		width: 25%;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
	}

	@media (max-width: 650px) {
		#list {
			max-height: unset;
		}
		#list-container, #definitions {
            scroll-snap-align: start;
			flex-shrink: 0;
			flex-basis: 90%;
		}
		main {
			scroll-snap-type: x mandatory;
		}
	}
</style>

<div id="list">
	<AppHeader>
		<a href="/export"><Icon icon="clone" />Anki Export</a>
	</AppHeader>
	<main>
		<div id="list-container">
			<div id="toolbar">
				<button on:click={undo}><Icon icon="undo" /> Undo Delete</button>
				{#if $settings.autoSpeechSynthesis || $settings.speechSynthesis}
					<button on:click={stop} disabled={!speaking}><Icon icon="stop" /> Stop Voice</button>
				{/if}
				<button on:click={() => showAdd = true}><Icon icon="plus" /> Add Phrases</button>
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

<Toasts dockedAt="bottom-center" />

<svelte:window on:keydown={keydown} />

<script>
	import Definitions from './DictionarySearchPanel.svelte';
	import Help from "../Help.svelte";
	import Phrase from './Phrase.svelte';
	import {Icon, Modal, Toasts} from 'sheodox-ui';
	import {say} from '../speech'
	import phraseStore from '../phraseStore';
	import Footer from '../Footer.svelte';
	import AppHeader from '../AppHeader.svelte';
	import NoMorePhrases from './NoMorePhrases.svelte';
	import AddPhrases from './AddPhrases.svelte';
	import {hasAddedPhrases} from "../metadataStore";
	import {settings} from '../metadataStore';

	let selection = '',
		initiallyLoading = true,
		showAdd = false,
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
		const text = e.detail.text
		if ($settings.autoSpeechSynthesis) {
			say(text);
		}
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