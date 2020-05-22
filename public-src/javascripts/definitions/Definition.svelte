<style>
	.info {
		color: gray;
	}
	h1 {
		text-transform: capitalize;
		margin-top: 0;
		margin-bottom: 0;
		font-size: 1.75rem;
		text-align: center;
	}
	h2 {
		display: inline;
	}

	.definition {
		flex: 1;
		overflow: auto;
		padding: 0 1rem 1rem 1rem;
	}
	button.small {
		font-size: 0.7rem;
		padding: 0.2rem;
	}

	ol {
		margin-top: 0.2rem;
	}
	.alternate-forms {
		color: #8293a1;
		margin-left: 1rem;
	}
    .alternate-forms :global(ruby:not(:first-of-type)) {
		margin-left: 0.5rem;
	}
	.selected {
		background: var(--accent-gradient-faint);
	}
	.search-result {
		padding: 0.3rem;
		border-radius: 3px;
		position: relative;
	}
	.selected-definition-message {
		position: absolute;
		right: 0;
		top: 0;
		margin: 0;
		padding: 0.2rem;
		background: black;
		opacity: 0.4;
		border-radius: 3px;
	}
</style>

<div class="definition">
	{#if !lookup}
		<h1>{source}</h1>
        <p>Search to see {source} definitions here!</p>
	{:else}
		{#await lookup }
			<h1>{source}</h1>
			<Loading />
		{:then result}
			<h1><ExternalLink href="{result.href}">{source}</ExternalLink></h1>
			<div in:fly={{y: 200}}>
				{#if result.definitions.length > 0}
					{#each result.definitions as definition}
                    	<div class="search-result" class:selected={selectedDefinition === definition.href}>
							<div class="title">
								<h2>
									<ExternalLink href={definition.href}>
										<JapaneseWord word={definition.word} reading={definition.reading} />
									</ExternalLink>
								</h2>
								{#each (definition.tags || []) as tag}
									<Tag tag={tag} />
								{/each}
							</div>
							{#if mode === 'export' && selectedDefinition === definition.href}
								<p class="selected-definition-message">Selected Definition</p>
							{/if}
							{#if mode === 'list'}
								<button class="small primary" on:click={() => addToReviews(definition.word)}>+ Add to reviews</button>
							{:else}
								<button
										class="small primary"
										on:click={() => selectForExport(definition)}
								>
									Select
								</button>
							{/if}
							<button on:click={() => say(definition.word)} class="small">Say word</button>
							{#if definition.reading}
								<button on:click={() => say(definition.reading)} class="small">Say reading</button>
							{/if}
							<ol>
								{#each definition.meanings as meaning}
									<li>
										{#if meaning.preInfo}
											<small class="info">{meaning.preInfo}</small>
											<br>
										{/if}
										{meaning.definition}
										<small class="info">{meaning.info || ''}</small></li>
								{/each}
							</ol>
							{#if definition.alternateForms && definition.alternateForms.length > 0}
								<p class="alternate-forms">
									Alternates:
									{#each definition.alternateForms as alt, index}
										{#if mode === 'export'}
                                        	<button class="small" on:click={exportAlternate(alt, definition)}>
												<JapaneseWord word={alt.word} reading={alt.reading} />
											</button>
										{:else}
											<JapaneseWord word={alt.word} reading={alt.reading} />
										{/if}

										{#if index + 1 < definition.alternateForms.length}
											<span>, </span>
										{/if}
									{/each}
								</p>
							{/if}
						</div>
					{/each}
				{:else}
					<p>No results found for "{term}"</p>
				{/if}
			</div>
		{/await}
	{/if}
</div>

<svelte:window on:keydown={shortcuts} />

<script>
    import {fly} from 'svelte/transition';
	import {createEventDispatcher} from 'svelte';
	import {say} from '../speech';
	import Loading from "../Loading.svelte";
	import Tag from './Tag.svelte';
	import ExternalLink from "../ExternalLink.svelte";
	import JapaneseWord from "./JapaneseWord.svelte";
	import phraseStore from '../phraseStore';
	export let source = '';
	export let term = '';
	export let isPrimary = false;
	export let mode = 'list'; // list or export
	export let selectedDefinition = null; //the 'id', (a.k.a. unique link) to the definition that's selected for export

	let timer,
		definitions = [];

	const dispatch = createEventDispatcher(),
		cloneObject = obj => JSON.parse(JSON.stringify(obj)),
		getDef = async (phrase) => {
		clearTimeout(timer);
		if (!phrase) {
			return;
		}

		return Promise.resolve()
			.then(() => fetch(`lookup/${source}/${encodeURIComponent(phrase)}/`)
			.then(res => res.json()));
	};

	function addToReviews(word) {
		phraseStore.action(`add/${encodeURIComponent(word)}`)
	}

	function selectForExport(definition, {word, reading} = {}, autoExported=false) {
		//export is always user triggered, autoExport is just automatically notifying of the first definition result,
		//so we can auto-select the most likely definition when exporting
		dispatch(autoExported ? 'autoSelect' : 'select', {
			source,
			//a direct link to the definition is going to be unique
			id: definition.href,
            //word is what is on the front of the flash cards, it can be altered,
			//either because it's usually kana, or they chose an alternate spelling to study
			//but in either case, we want to show the original dictionary result's original spelling
			//on the back of the card
			word: word || definition.word,
			reading: reading || definition.reading,
			//keep the consumer of this export from changing local definition objects, exporting might to do some mutation on this
			definition: cloneObject(definition)
		});
	}

	function exportAlternate(alternate, definition) {
		const definitionCopy = cloneObject(definition);
		selectForExport(definitionCopy, alternate);
	}

	function shortcuts(e) {
		//for the primary (jisho) search, Ctrl+Enter should add the first item to the review list
		if (isPrimary && e.key === 'Enter' && e.ctrlKey && definitions.length) {
			addToReviews(definitions[0].word);
		}
	}

	let lookup;
	$: {
		if (term) {
			lookup = getDef(term);

			//cache definitions for easy usage in script
			lookup.then(results => {
				definitions = results.definitions;

				// auto-select the first definition, depends on the consumer of this component to listen or not
				if (results.definitions.length) {
					selectForExport(results.definitions[0], {}, true);
				}
			})
		}
	}
</script>
