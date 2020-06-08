<style>
    .builder {
		background: var(--panel-bg);
		margin: 1rem;
		padding: 1rem;
		max-width: 950px;
		align-self: flex-start;
		flex: 3;
	}
	.title-bar {
		padding: 0 1rem;
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
    .centered {
		justify-content: center;
	}
	p {
		font-size: 1.1rem;
	}
	h2 {
		text-overflow: ellipsis;
        overflow: hidden;
		white-space: nowrap;
	}
	button.done {
		white-space: nowrap;
        transition: color 0.3s, background 0.3s;
	}
	.tweaks {
		margin: 1rem;
		background: #404759;
		border-radius: 5px;
		align-items: end;
	}
    .definition-area {
		position: relative;
	}
	#definition-search {
		position: absolute;
		top: -1rem;
		left: 50%;
		transform: translateX(-50%);
	}
	.sentence-select-hint {
		text-align: center;
	}
</style>

<div class="builder" in:fly={{y:50, duration: 100}}>
	<div class="row spaced-out title-bar header">
		<h2>Card Builder</h2>
		<!-- even if cards have been made for this phrase, don't 'primary' the button if there are unsaved changes -->
		<div class="header-buttons">
			<button on:click={back} disabled={$currentPhraseIndex === 0}>Back</button>
			<button on:click={done} class="done" class:primary={!selection && $currentPhraseCardCount}>
				{#if $currentPhraseCardCount}
					Next phrase
				{:else}
					Skip this phrase
				{/if}
			</button>
		</div>
	</div>
	<p class="sentence-select-hint">Please select a word from this context sentence you didn't know.</p>
	<p class="context-sentence">
		<SelectableText text={phrase.phrase} on:text-select={setSelection}/>
	</p>
	{#if selection}
		{#if $definition}
			<div class="row centered">
			<div class="row tweaks" in:fly={{y: 50}}>
				<div class="column">
					<label for="tweak-word">Word</label>
                    <div>
						<input id="tweak-word" bind:value={$word} />
						<button
								on:click={() => word.set(get(reading))}
								title="Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead."
								disabled={$word === $reading}
						>
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
						class="primary"
						on:click={addCard}
						disabled={!$word}
					>
						Add Card
					</button>
				</div>
				</div>
			</div>
		{/if}

		<div class="definition-area">
			<input id="definition-search" bind:value={searchTerm} aria-label="definition search" placeholder="なにかを入力する..." on:keyup={onSearchType}/>
			<!-- using a keyed each for one element so it always rebuilds -->
			{#each [selection] as sel (sel) }
				<div class="column" in:fly={{y: 50}} >
					<div class="definitions">
						<DictionarySearchResults
							source="jisho"
							isPrimary={true}
							term={sel}
							mode="export"
						/>
						<DictionarySearchResults
							source="goo"
							isPrimary={false}
							term={sel}
							mode="export"
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
<script>
	import {fly} from 'svelte/transition';
	import {flip} from 'svelte/animate';
	import {get} from 'svelte/store';
	import {createEventDispatcher} from 'svelte';
	import DictionarySearchResults from '../definitions/DictionarySearchResults.svelte';
	import {
		card,
		resetCard,
		word,
		reading,
		definition,
		context
	} from './currentCardStore';
	import {
		currentPhraseCardCount,
		currentPhraseIndex,
		addCard as addCardToStore
	} from './cardsStore';
	import SelectableText from "../SelectableText.svelte";
	//resetting on mount will clear out previous words dirty fields if a card was in progress but not added
	resetCard();

	export let phrase = '';

	$: context.set(phrase.phrase);

	const DEBOUNCE_TIMEOUT = 500,
			dispatch = createEventDispatcher();

	let selection = '', //what was selected from the phrase
			searchTerm = '', //what we're searching dictionaries for
			selectedDefinitionId = null; //an id matching a definition that was selected from the definition search

	function setSelection(e) {
		const selected = e.detail
		if (selected) {
			selection = selected;
			searchTerm = selected;
		}
	}

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