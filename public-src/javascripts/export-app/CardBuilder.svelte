<style>
    .builder {
		background: #151d29;
		margin: 1rem;
		padding: 1rem;
		max-width: 950px;
	}
	.title-bar {
		background: #2a3450;
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
    small {
		font-size: 0.9rem;
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
		background: #14171e;
		border-radius: 5px;
		align-items: end;
	}

	.created-cards {
		padding: 0 0.2rem;
		background: #151d29;
		border-radius: 4px;
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
</style>

<div class="builder" in:fly={{y:50}}>
	<div class="row spaced-out title-bar">
		<h2 title={phrase.phrase}>Card Builder</h2>
		{#if cards.length}
			<small class="created-cards">Cards created: {cards.map(c => c.word).join(', ')}</small>
		{/if}
		<button on:click={done} class="done" class:primary={cards.length}>
			{#if cards.length}
                Next phrase
				<br>
				(Add {cards.length} {cards.length === 1 ? 'card' : 'cards'})
			{:else}
				Skip this phrase
			{/if}
		</button>
	</div>
	<p>Please select a word from this context sentence you didn't know, or hit the button above when you're done.</p>
	<p class="context-sentence" on:mouseup={setSelection}>
		{phrase.phrase}
	</p>
	{#if selection}
		{#if $definition}
			<div class="row centered">
			<div class="row tweaks" in:fly={{y: 50}}>
				<div class="column">
					<label for="tweak-word">Word</label>
					<input id="tweak-word" bind:value={$word} />
				</div>

				<div class="column">
					<button
						on:click={() => word.set(get(reading))}
						title="Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead."
						disabled={$word === $reading}
					>
						← Copy
					</button>
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
		definition
	} from './currentCardStore';

	export let phrase = '';

	const DEBOUNCE_TIMEOUT = 500,
		dispatch = createEventDispatcher();

	let cards = [],
		selection = '', //what was selected from the phrase
        searchTerm = '', //what we're searching dictionaries for
		selectedDefinitionId = null; //an id matching a definition that was selected from the definition search

	function setSelection() {
		const selected = window.getSelection().toString().trim();
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
		cards.push(get(card))
        resetCard();
		selection = '';
		cards = cards;
	}

	function done() {
		dispatch('cards', cards);
	}
</script>