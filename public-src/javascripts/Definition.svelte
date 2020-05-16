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
		padding: 20px;
	}
	button.small {
		font-size: 0.7rem;
		padding: 0.2rem;
	}

	ol {
		margin-top: 0.2rem;
	}
	.tag {
		color: #8293a1;
		background-color: #1f2b3d;
		font-size: 0.6rem;
		padding: 0 0.2rem;
	}
	.tag.common {
		color: #00ffac;
	}
	.tag:not(:last-of-type) {
		margin-right: 0.3rem;
	}
	.alternate-forms {
		color: #8293a1;
		margin-left: 1rem;
	}
    .alternate-forms :global(ruby:not(:first-of-type)) {
		margin-left: 0.5rem;
	}
</style>

<div class="definition">
	{#await lookup }
		<h1>{source}</h1>
		<Loading />
	{:then result}
		<h1><ExternalLink href="{result.href}">{source}</ExternalLink></h1>
		{#if result.definitions.length > 0}
			{#each result.definitions as definition}
				<div class="title">
					<h2>
						<ExternalLink href={definition.href}>
							<JapaneseWord word={definition.word} reading={definition.reading} />
						</ExternalLink>
					</h2>
					{#each (definition.tags || []) as tag}
						<span class="tag" class:common={tag === 'common'}>{tag}</span>
					{/each}
				</div>
				<button class="small" on:click={() => addToReviews(definition.word)}>+ Add to reviews</button>
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
							<JapaneseWord word={alt.word} reading={alt.reading} />
							{#if index + 1 < definition.alternateForms.length}
								<span>, </span>
							{/if}
						{/each}
					</p>
				{/if}
			{/each}
		{:else}
			<p>No results found for "{term}"</p>
		{/if}
	{/await}
</div>

<svelte:window on:keydown={shortcuts} />

<script>
	import {say} from './speech';
	import {createEventDispatcher} from 'svelte';
	import Loading from "./Loading.svelte";
	import ExternalLink from "./ExternalLink.svelte";
	import JapaneseWord from "./JapaneseWord.svelte";
	export let source = '';
	export let term = '';
	export let isPrimary = false;

	let timer,
		definitions = [];

	const dispatch = createEventDispatcher(),
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
		fetch(`add/${encodeURIComponent(word)}`).then(res => res.json()).then(list => {
			dispatch('updateList', {list})
		});
	}

	function shortcuts(e) {
		//for the primary (jisho) search, Ctrl+Enter should add the first item to the review list
		if (isPrimary && e.key === 'Enter' && e.ctrlKey && definitions.length) {
			addToReviews(definitions[0].word);
		}
	}

	let lookup;
	$: {
		lookup = getDef(term);

		//cache definitions for easy usage in script
		lookup.then(results => {
			definitions = results.definitions;
		})
	}
</script>
