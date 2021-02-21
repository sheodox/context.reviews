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
		padding: 0 0.5rem 0.5rem 0.5rem;
	}
	.unbound-height {
		/* when the search results don't have a max height (the export mode) hiding the overflow won't
		prevent anything from showing, but it will prevent the fly transition from making a scrollbar briefly show */
		overflow: hidden;
	}
	.capitalize {
		text-transform: capitalize;
	}
	.hint-text {
		text-align: center;
	}
</style>

<div class="definition" class:unbound-height={mode === 'export'}>
	{#if !lookup}
		<h1>{source}</h1>
		<p class="hint-text">Search to see <span class="capitalize">{source}</span> definitions here!</p>
	{:else}
		{#await lookup }
			<h1>{source}</h1>
			<Loading />
		{:then result}
			<h1><ExternalLink href="{result.href}">{source}</ExternalLink></h1>
			<div in:fly={{y: 50}}>
				{#if result.definitions.length > 0}
					{#each result.definitions as definition}
                        <Word
							source={source}
							definition={definition}
							mode={mode}
							bind:searchTerm={term}
							on:editDefinition
						/>
					{/each}
				{:else}
					<p class="hint-text">No results found for "{term}"</p>
				{/if}
			</div>
		{:catch error}
			<h1>{source}</h1>
			<div in:fly={{y: 50}}>
				<p class="hint-text">{error.message}</p>
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
	import Word from './DictionaryEntry.svelte';
	import phraseStore from '../phraseStore';
	import {selectDefinition} from '../export-app/currentCardStore';
	import {createHttpErrorToast, getDefaultHttpErrorMessage} from "../http-error-toasts";
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

			return fetch(`lookup/${source}/${encodeURIComponent(phrase)}/`)
				.then(async res => {
					const result = await res.json();
					if (res.ok) {
						return result;
					}

					if (!result.message) {
						//server error responses will generally just have an 'error' and 'requestId' property,
						//lookup error responses have a 'message' property which we want to show in the definition
						//panel and not make a big deal of, such as a 413 when they try searching for a really long string
						await createHttpErrorToast(null, res, result)
					}
					throw new Error(result.message || getDefaultHttpErrorMessage(res));
				});
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
				if (!isPrimary) {
					return;
				}

				// auto-select the first definition, depends on the consumer of this component to listen or not
				if (results.definitions.length) {
					selectDefinition(source, results.definitions[0])
					dispatch('first-word', results.definitions[0].word)
				}
				else {
					//when nothing matches, provide the search term, so it can be easily searched in alternate dictionaries
					dispatch('first-word', term);
				}
			})
		}
	}
</script>
