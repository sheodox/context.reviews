<style>
	.card-builder {
		flex: 3;
	}
	.builder {
		display: flex;
		flex-direction: column;
		max-width: 80rem;
		margin: 1rem auto;
		padding: 1rem;
	}
	.title-bar {
		align-items: center;
	}
	.context-sentence {
		font-size: 2rem;
		text-align: center;
		margin: 0;
	}
	.definitions {
		display: flex;
		flex-direction: row;
	}
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.spaced-out {
		justify-content: space-between;
	}
	p {
		font-size: 1.1rem;
	}
	h2 {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		margin: 0;
	}
	button.done {
		white-space: nowrap;
	}
	.definition-area {
		position: relative;
	}
	.sentence-select-hint {
		text-align: center;
	}
	button.edit-definition {
		align-self: center;
	}
	.panel-body {
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 850px) {
		.builder {
			min-width: 90vw;
		}
		.title-bar {
			flex-direction: column;
		}
		.definitions {
			flex-direction: column;
		}
	}
</style>

<div class="card-builder">
	<div class="builder">
		<div class="row spaced-out title-bar header">
			<h2>Anki Export</h2>
			<!-- even if cards have been made for this phrase, don't 'primary' the button if there are unsaved changes -->
			<div class="header-buttons">
				<button on:click={back} disabled={$currentPhraseIndex === 0}><Icon icon="angle-left" />Back</button>
				<button on:click={done} class="done" class:primary={!$definitionSearchTerm && $currentPhraseCardCount}>
					{#if $currentPhraseCardCount}
						Next Phrase
					{:else}
						Skip This Phrase
					{/if}
					<Icon icon="angle-right" />
				</button>
			</div>
		</div>
		<div class="panel-body">
			<p class="context-sentence">
				<SelectableText text={phrase.phrase} on:text-select={setSelection} />
			</p>
			{#if $definition}
				<CardBuilderEdit
					isSelectingStyle={showStyleChoice}
					on:confirm={() => (showStyleChoice = true)}
					on:customize={() => (showMeaningEditor = true)}
					isCustomizing={showMeaningEditor}
				/>
			{/if}

			{#if showStyleChoice}
				<CardStyleChoice on:done={addCard} on:cancel={() => (showStyleChoice = false)} />
			{:else if showMeaningEditor}
				{#if $definition}
					<button on:click={discardCustomizations} class="edit-definition danger mt-3"
						><Icon icon="times" />Discard Customizations</button
					>
					<MeaningEditor bind:meanings={$definition.meanings} />
				{/if}
			{:else}
				<div class="definition-area mt-4" in:fly={{ y: 25 }}>
					<div class="f-row justify-content-center">
						<TextInput id="definition-search" bind:value={searchTerm} on:keyup={onSearchType}>
							Definition Search
						</TextInput>
					</div>

					{#if searchTerm}
						<!-- using a key so it always rebuilds and shows transitions between different searches -->
						{#key $definitionSearchTerm}
							<div class="definitions" in:fly={{ y: 50 }}>
								<DictionarySearchResults
									source="jisho"
									isPrimary={true}
									bind:term={$definitionSearchTerm}
									mode="export"
								/>
								<OtherDictionaryLinks term={$word} />
							</div>
						{/key}
					{/if}
				</div>
			{/if}

			{#if !$definitionSearchTerm}
				<div in:fly={{ y: 25 }}>
					<p class="sentence-select-hint">
						Please highlight a word in the context sentence you don't know or search for something.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { get } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import DictionarySearchResults from '../definitions/DictionarySearchResults.svelte';
	import {
		definitionSearchTerm,
		card,
		resetCard,
		word,
		definition,
		context,
		wordHighlightRange,
		afterNotes,
		beforeNotes,
	} from '../stores/current-card';
	import { currentPhraseCardCount, currentPhraseIndex, addCard as addCardToStore } from '../stores/cards';
	import SelectableText from '../SelectableText.svelte';
	import { Icon, TextInput } from 'sheodox-ui';
	import MeaningEditor from './MeaningEditor.svelte';
	import OtherDictionaryLinks from '../definitions/OtherDictionaryLinks.svelte';
	import CardStyleChoice from './CardStyleChoice.svelte';
	import type { Phrase } from '../../shared/types/phrases';
	import CardBuilderEdit from './CardBuilderEdit.svelte';

	//resetting on mount will clear out previous words dirty fields if a card was in progress but not added
	resetCard();

	export let phrase: Phrase;

	$: context.set(phrase.phrase);

	const DEBOUNCE_TIMEOUT = 500,
		dispatch = createEventDispatcher<{ done: void; back: void }>();

	let showMeaningEditor = false,
		showStyleChoice = false,
		searchTerm = ''; //what we're searching dictionaries for

	function setSelection(e: CustomEvent<{ text: string; range: [number, number] }>) {
		showMeaningEditor = false;
		const selected = e.detail.text;
		if (selected) {
			$wordHighlightRange = e.detail.range;
			$definitionSearchTerm = selected;
			searchTerm = selected;
		}
	}

	// this lets 'see also' buttons change the search results and the search field text
	$: searchTerm = $definitionSearchTerm;

	let searchTypingDebounce: ReturnType<typeof setTimeout>;

	function onSearchType() {
		//if escape was pressed twice in a row quickly, it's the clear field shortcut
		clearTimeout(searchTypingDebounce);
		searchTypingDebounce = setTimeout(() => {
			if (searchTerm) {
				$definitionSearchTerm = searchTerm;
			}
		}, DEBOUNCE_TIMEOUT);
	}

	function addCard() {
		addCardToStore(get(card));
		resetCard();
		showStyleChoice = false;
		showMeaningEditor = false;
		$definitionSearchTerm = '';
	}

	function discardCustomizations() {
		// these are not populated by Jisho and are strictly user customizable, reset them as they won't
		// auto-reset like the meanings do when the definition selector is rendered again
		$afterNotes = '';
		$beforeNotes = '';
		showMeaningEditor = false;
	}

	function done() {
		dispatch('done');
	}

	function back() {
		dispatch('back');
	}
</script>
