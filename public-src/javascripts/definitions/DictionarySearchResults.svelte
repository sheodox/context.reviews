<style>
	h1 {
		text-transform: capitalize;
		margin-top: 0;
		margin-bottom: 0;
		font-size: 1.75rem;
		text-align: center;
	}

	.definition {
		flex: 1;
		overflow: auto;
		padding: 0 1rem 1rem 1rem;
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
                        <Word
							source={source}
							definition={definition}
							mode={mode}
						/>
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
	import Loading from "../Loading.svelte";
	import ExternalLink from "../ExternalLink.svelte";
	import Word from './Word.svelte';
	import phraseStore from '../phraseStore';
	import {selectDefinition} from '../export-app/currentCardStore';
	export let source = '';
	export let term = '';
	export let isPrimary = false;
	export let mode = 'list'; // list or export

	let definitions = [];

	const dispatch = createEventDispatcher(),
		cloneObject = obj => JSON.parse(JSON.stringify(obj)),
		getDef = async (phrase) => {
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
				if (results.definitions.length && isPrimary) {
					selectDefinition(source, results.definitions[0])
				}
			})
		}
	}
</script>
