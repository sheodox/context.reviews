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
		{#if word}
			<div class="column tweaks" in:fly={{y: 100}}>
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
					<button class="primary" on:click={addCard}>Add Card</button>
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

		<p>
			Select the best match for "{selection}"
		</p>

		<!-- using a keyed each for one element so it always rebuilds -->
		{#each [selection] as sel (sel) }
			<div class="definitions" animate:flip>
				<Definition source="jisho" isPrimary={false} term={sel} mode="export" on:selection={setSelectedDefinition} />
				<Definition source="goo" isPrimary={false} term={sel} mode="export" on:selection={setSelectedDefinition} />
			</div>
		{/each}
	{/if}
</div>
<script>
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';
	import {createEventDispatcher} from 'svelte';
	import Definition from '../definitions/Definition.svelte';
	import CardBuilder from "./CardBuilder.svelte";

	export let phrase = '';

	const dispatch = createEventDispatcher(),
		stages = {
			select: 'select',
			define: 'define',
			tweak: 'tweak'
		};

	let stage = stages.select,
		cards = [],
		selection = '',
		word = '',
		reading = '',
		detail = '',
		source = '';

	function setSelection() {
		const selected = window.getSelection().toString().trim();
		if (selected) {
			selection = selected;
			stage = stages.define;
		}
	}

	function setSelectedDefinition(e) {
		const result = e.detail;
		word = result.word;
		reading = result.reading || result.word;
		detail = result;
		source = result.source;

		stage = stages.tweak;
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
		detail = {};

		cards = cards;
		stage = stages.select;
	}

	function done() {
		dispatch('cards', cards);
	}
</script>