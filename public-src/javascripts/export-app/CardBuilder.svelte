<style>
    .builder {
		flex: 3;
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
	.column {
		display: flex;
		flex-direction: column;
		margin: 1rem;
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
	.tweaks {
		margin: 1rem;
		background: var(--shdx-gray-600);
		border-radius: 5px;
		align-self: center;
		box-shadow: var(--shdx-shadow-5);
	}
	.tweaks button {
		white-space: nowrap;
	}
    .tweaks .card-fields {
		align-items: end;
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
	.card-errors {
		justify-content: center;
	}
    .card-errors p {
		font-size: 0.9rem;
        border-radius: 3px;
	}
	.suggested:enabled {
		color: var(--shdx-primary);
	}
	@media (max-width: 850px) {
		.tweaks .card-fields {
			flex-direction: column;
			align-items: start;
		}
		.title-bar {
			flex-direction: column;
		}
		.definitions {
			flex-direction: column;
		}
	}
</style>

<div class="builder">
	<div class="row spaced-out title-bar header">
		<h2>Anki Export</h2>
		<!-- even if cards have been made for this phrase, don't 'primary' the button if there are unsaved changes -->
		<div class="header-buttons">
			<button on:click={back} disabled={$currentPhraseIndex === 0}><Icon icon="angle-left" />Back</button>
			<button on:click={done} class="done" class:primary={!selection && $currentPhraseCardCount}>
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
			<SelectableText text={phrase.phrase} on:text-select={setSelection} highlightRange={$wordHighlightRange} />
		</p>
		{#if $definition}
			<div class="centered tweaks">
				<div class="row card-fields">
					<div class="column">
						<TextInput id="tweak-word" bind:value={$word}>
							Word
							<button
                                slot="append"
								on:click={() => word.set(get(reading))}
								title={$useKanaTooltip}
								class:suggested={$suggestUseKana}
								disabled={$word === $reading}
							>
								{#if $suggestUseKana}
									<Icon icon="hat-wizard" />
								{/if}
								Use Kana
							</button>
						</TextInput>
					</div>

					<div class="column">
						<TextInput id="tweak-reading" bind:value={$reading}>
							Reading
						</TextInput>
					</div>

					<div class="column">
						<button
							on:click={() => showStyleChoice = true}
							class="primary"
							disabled={!$word || !$wordIsUnique || showStyleChoice}
						>
							<Icon icon="plus" />
							Add Card
						</button>
					</div>
				</div>
				<div class="row card-errors">
					{#if !$wordIsUnique}
						<p class="shdx-badge-red m-3 p-1"><Icon icon="exclamation-circle" />A card has already been created for this word.</p>
					{/if}
				</div>
			</div>
		{/if}

		{#if showMeaningEditor}
			{#if $definition}
				<button on:click={() => showMeaningEditor = false} class="edit-definition danger"><Icon icon="times" />Discard Customizations</button>
				<MeaningEditor bind:meanings={$definition.meanings} />
			{/if}
		{:else if showStyleChoice}
			<CardStyleChoice on:done={addCard} on:cancel={() => showStyleChoice = false}/>
		{:else}
			<div class="definition-area" in:fly={{y: 25}}>
				<div class="f-row justify-content-center">
					<TextInput id="definition-search" class="input-group" bind:value={searchTerm} on:keyup={onSearchType}>
						Definition Search
					</TextInput>
				</div>

				{#if searchTerm}
					<!-- using a key so it always rebuilds and shows transitions between different searches -->
					{#key selection}
						<div class="definitions" in:fly={{y: 50}} >
							<DictionarySearchResults
								source="jisho"
								isPrimary={true}
								bind:term={selection}
								mode="export"
								on:editDefinition={() => showMeaningEditor = true}
							/>
							<OtherDictionaryLinks term={$word} />
						</div>
					{/key}
				{/if}
			</div>
		{/if}

		{#if !selection}
			<div in:fly={{y: 25}}>
				<p class="sentence-select-hint">Please select a word from the context sentence you didn't know or search for something.</p>
			</div>
		{/if}
	</div>
</div>
<script>
	import {fly} from 'svelte/transition';
	import {get, derived} from 'svelte/store';
	import {createEventDispatcher} from 'svelte';
	import DictionarySearchResults from '../definitions/DictionarySearchResults.svelte';
	import {
		card,
		resetCard,
		word,
		reading,
		source,
		definition,
		context,
		wordIsUnique,
		wordHighlightRange
	} from './currentCardStore';
	import {
		currentPhraseCardCount,
		currentPhraseIndex,
		addCard as addCardToStore
	} from './cardsStore';
	import SelectableText from "../SelectableText.svelte";
	import {Icon, TextInput} from 'sheodox-ui';
	import MeaningEditor from './MeaningEditor.svelte';
	import OtherDictionaryLinks from "../definitions/OtherDictionaryLinks.svelte";
	import CardStyleChoice from "./CardStyleChoice.svelte";
	//resetting on mount will clear out previous words dirty fields if a card was in progress but not added
	resetCard();

	export let phrase = '';

	$: context.set(phrase.phrase);

	const suggestUseKana = derived([definition], ([definition]) => {
			return definition &&
				definition.meanings.some(({info}) => info.includes('Usually written using kana alone')) &&
				//don't suggest to use the kana spelling if the main definition is what you searched for, in that case you likely
				//searched for it because you found it somewhere and if a resource is using the non-kana spelling it
				//is probably more useful for you to learn the dictionary form to better understand what you're reading.
				//それ is usually kana only, but if you read a book that uses 其れ it'll probably spell it that way again so learn it!
				selection !== definition.word;
		}),
		useKanaTooltip = derived([suggestUseKana], ([suggested]) => {
			const base = 'Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead.';
			return base + (suggested ? `\n\nOne of the meanings for this definition says it's usually spelled with only kana.` : '')
		});

	const DEBOUNCE_TIMEOUT = 500,
		dispatch = createEventDispatcher();

	let showMeaningEditor = false,
		showStyleChoice = false,
		selection = '', //what was selected from the phrase
		searchTerm = '', //what we're searching dictionaries for
		selectedDefinitionId = null; //an id matching a definition that was selected from the definition search

	function setSelection(e) {
		showMeaningEditor = false;
		const selected = e.detail.text
		if (selected) {
			$wordHighlightRange = e.detail.range;
			selection = selected;
			searchTerm = selected;
		}
	}

	// this lets 'see also' buttons change the search results and the search field text
	$: searchTerm = selection;

	let searchTypingDebounce;

	function onSearchType() {
		//if escape was pressed twice in a row quickly, it's the clear field shortcut
		clearTimeout(searchTypingDebounce);
		searchTypingDebounce = setTimeout(() => {
			if (searchTerm) {
				selection = searchTerm;
			}
		}, DEBOUNCE_TIMEOUT)
	}

	function addCard() {
		addCardToStore(get(card));
		resetCard();
		showStyleChoice = false;
		showMeaningEditor = false;
		selection = '';
	}

	function done() {
		dispatch('done');
	}

	function back() {
		dispatch('back');
	}
</script>