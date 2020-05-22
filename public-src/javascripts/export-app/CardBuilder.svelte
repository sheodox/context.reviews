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
	}
	.definitions {
		display: flex;
		flex-direction: row;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.row:not(:last-of-type) {
		margin-bottom: 1rem;
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
		padding: 1rem;
		background: #14171e;
		border-radius: 5px;
	}
	.created-cards {
		padding: 0 0.2rem;
		background: #151d29;
		border-radius: 4px;
	}
	#definition-search {
		margin: 0 auto;
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
		{#if detail}
			<div class="column tweaks" in:fly={{y: 50}}>
				<p>Make any final tweaks you want to this word</p>
				<div class="row">
					<div class="column">
						<label for="tweak-word">Word</label>
						<input id="tweak-word" bind:value={word} />
					</div>

					<div class="column">
						<label for="tweak-reading">Reading</label>
						<input id="tweak-reading" bind:value={reading} />
					</div>
				</div>

				<div class="row">
					<button
							class="primary"
							on:click={addCard}
							disabled={!word}
					>
						Add Card
					</button>
					<button
							on:click={() => word = reading}
							title="Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead."
							disabled={word === reading}
					>
						Usually kana word?
					</button>
				</div>
			</div>
		{/if}

		<div class="row centered" in:fly={{y: 100}}>
			<input id="definition-search" bind:value={searchTerm} aria-label="definition search" placeholder="なにかを入力する..." on:keyup={onSearchType}/>
		</div>
		<!-- using a keyed each for one element so it always rebuilds -->
		{#each [selection] as sel (sel) }
        	<div class="column" in:fly={{y: 50}} >
				<p>
					Select the best match for "{sel}"
				</p>
				<div class="definitions">
					<Definition
						source="jisho"
						isPrimary={false}
						term={sel}
						mode="export"
						on:select={setSelectedDefinition}
						on:autoSelect={setSelectedDefinition}
						selectedDefinition={selectedDefinitionId}
					/>
					<Definition
						source="goo"
						isPrimary={false}
						term={sel}
						mode="export"
						on:select={setSelectedDefinition}
						selectedDefinition={selectedDefinitionId}
					/>
				</div>
			</div>
		{/each}
	{/if}
</div>
<script>
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';
	import {createEventDispatcher} from 'svelte';
	import Definition from '../definitions/Definition.svelte';

	export let phrase = '';

	const DEBOUNCE_TIMEOUT = 500,
		dispatch = createEventDispatcher();

	let cards = [],
		selection = '', //what was selected from the phrase
		word = '', // details about the word selected from a definition search
		reading = '',
		detail = '',
		source = '',
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

	function setSelectedDefinition(e) {
		const result = e.detail;
		word = result.word;
		reading = result.reading || result.word;
		detail = result.definition;
		source = result.source;
		selectedDefinitionId = result.id;
	}

	function addCard() {
		cards.push({
			context: phrase.phrase,
			word,
			reading,
			detail
		})
		selection = '';
		word = '';
		reading = '';
		source = '';
		detail = '';

		cards = cards;
	}

	function done() {
		dispatch('cards', cards);
	}
</script>