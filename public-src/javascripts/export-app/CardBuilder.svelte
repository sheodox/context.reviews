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
		background: var(--panel-bg);
		border-radius: 5px;
		align-self: center;
	}
	.tweaks input {
		font-size: 1.8rem;
        width: 15rem;
	}
    .tweaks .card-fields {
		align-items: end;
	}
    .definition-area {
		position: relative;
	}
	#definition-search {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
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
		color: #ff6363;
		font-size: 0.9rem;
		margin: 0;
	}
	.suggested:enabled {
		color: var(--suggestion);
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
		<h2>Card Builder</h2>
		<!-- even if cards have been made for this phrase, don't 'primary' the button if there are unsaved changes -->
		<div class="header-buttons">
			<button on:click={back} disabled={$currentPhraseIndex === 0}><Icon icon="arrow_back_ios" />Back</button>
			<button on:click={done} class="done" class:primary={!selection && $currentPhraseCardCount}>
				{#if $currentPhraseCardCount}
					Next Phrase
				{:else}
					Skip This Phrase
				{/if}
				<Icon icon="arrow_forward_ios" />
			</button>
		</div>
	</div>
	<div class="panel-body">
		<p class="sentence-select-hint">Please select a word from this context sentence you didn't know.</p>
		<p class="context-sentence">
			<SelectableText text={phrase.phrase} on:text-select={setSelection}/>
		</p>
		{#if selection}
			{#if $definition}
				<div class="centered tweaks">
					<div class="row card-fields">
						<div class="column">
							<label for="tweak-word">Word</label>
							<div class="input-group">
								<input id="tweak-word" bind:value={$word} />
								<button
									on:click={() => word.set(get(reading))}
									title={$useKanaTooltip}
									class:suggested={$suggestUseKana}
									disabled={$word === $reading}
								>
									{#if $suggestUseKana}
										<Icon icon="assistant" />
									{/if}
									Use Kana
								</button>
							</div>
						</div>

						<div class="column">
							<label for="tweak-reading">Reading</label>
							<input id="tweak-reading" bind:value={$reading} />
						</div>

						<div class="column">
							<button
								on:click={addCard}
								disabled={!$word || !$wordIsUnique}
							>
								<Icon icon="add" />
								Add Card
							</button>
						</div>
					</div>
					<div class="row card-errors">
						{#if !$wordIsUnique}
							<p>A card has already been created for this word.</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if showMeaningEditor}
				<button on:click={() => showMeaningEditor = false} class="edit-definition danger"><Icon icon="clear" />Discard Customizations</button>
				<MeaningEditor bind:meanings={$definition.meanings} />
			{:else}
				<div class="definition-area">
					<input id="definition-search" bind:value={searchTerm} aria-label="definition search" placeholder="なにかを入力する..." on:keyup={onSearchType}/>
					<!-- using a keyed each for one element so it always rebuilds (and shows transitions between different words) -->
					{#each [selection] as sel (sel) }
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
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
<script>
	import {fly} from 'svelte/transition';
	import {flip} from 'svelte/animate';
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
		wordIsUnique
	} from './currentCardStore';
	import {
		currentPhraseCardCount,
		currentPhraseIndex,
		addCard as addCardToStore
	} from './cardsStore';
	import SelectableText from "../SelectableText.svelte";
	import Icon from '../Icon.svelte';
	import MeaningEditor from './MeaningEditor.svelte';
	import OtherDictionaryLinks from "../definitions/OtherDictionaryLinks.svelte";
	//resetting on mount will clear out previous words dirty fields if a card was in progress but not added
	resetCard();

	export let phrase = '';

	$: context.set(phrase.phrase);

	const suggestUseKana = derived([definition], ([definition]) => {
			return definition && definition.meanings.some(({info}) => info.includes('Usually written using kana alone'));
		}),
		useKanaTooltip = derived([suggestUseKana], ([suggested]) => {
			const base = 'Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead.';
			return base + (suggested ? `\n\nOne of the meanings for this definition says it's usually spelled with only kana.` : '')
		});

	const DEBOUNCE_TIMEOUT = 500,
		dispatch = createEventDispatcher();

	let showMeaningEditor = false,
		selection = '', //what was selected from the phrase
		searchTerm = '', //what we're searching dictionaries for
		selectedDefinitionId = null; //an id matching a definition that was selected from the definition search

	function setSelection(e) {
		showMeaningEditor = false;
		const selected = e.detail
		if (selected) {
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
		selection = '';
	}

	function done() {
		dispatch('done');
	}

	function back() {
		dispatch('back');
	}
</script>