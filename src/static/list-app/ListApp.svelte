<style>
	th {
		font-size: 1.1rem;
		white-space: nowrap;
		background: none;
		text-align: left;
	}

	table {
		width: fit-content;
		margin: 0.5rem 0;
		border: none;
	}

	#list-container {
		flex: 3;
		max-height: 100%;
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
		#list-container,
		#definitions {
			scroll-snap-align: start;
			flex-shrink: 0;
			flex-basis: 90%;
		}
	}
</style>

<div id="list-container">
	<Toolbar />
	{#if initiallyLoading}
		<!-- show nothing when doing the initial list load, because if
			a loading indicator is shown for a super short time it'll be kind of jarring -->
	{:else if phrases.length === 0}
		<div>
			{#if $hasAddedPhrases}
				<NoMorePhrases />
			{:else}
				<Help showBackLink={false} />
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
					<Phrase {phrase} on:text-select={selected} />
				{/each}
			</tbody>
		</table>
	{/if}
</div>
<aside id="definitions" class="panel">
	<Definitions term={selection} />
</aside>

<script lang="ts">
	import Definitions from './DictionarySearchPanel.svelte';
	import Help from '../pages/Help.svelte';
	import Phrase from './Phrase.svelte';
	import { say } from '../speech';
	import phraseStore from '../stores/phrases';
	import NoMorePhrases from './NoMorePhrases.svelte';
	import { hasAddedPhrases, settings } from '../stores/metadata';
	import type { Phrase as PhraseType } from '../../shared/types/phrases';
	import Toolbar from './Toolbar.svelte';

	let selection = '',
		initiallyLoading = true,
		phrases: PhraseType[] = [];

	phraseStore.subscribe((list) => {
		//phrases inits null for toasts (it's null until the list is known) so need a fallback
		phrases = list || [];
		if (list) {
			initiallyLoading = false;
		}
	});

	$: {
		document.title = `${phrases.length} - Context.Reviews`;
	}

	function selected(e: CustomEvent<{ text: string }>) {
		const text = e.detail.text;
		if ($settings.autoSpeechSynthesis) {
			say(text);
		}
		selection = text;
	}
</script>
