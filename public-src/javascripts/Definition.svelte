<style>
	.info {
		color: gray;
	}
	h1 {
		text-transform: capitalize;
	}
	h3, h4 {
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
					<h3>
						<ExternalLink href={definition.href}>{definition.word}</ExternalLink>
						<button on:click={() => say(definition.word)} class="small">音声</button>
					</h3>
					{#if definition.reading}
						<h4>- ({definition.reading})</h4>
						<button on:click={() => say(definition.reading)} class="small">音声</button>
					{/if}
				</div>
				<button class="small" on:click={() => addToReviews(definition.word)}>+ Add to reviews</button>
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
			{/each}
		{:else}
			<p>No results found for "{term}"</p>
		{/if}
	{/await}
</div>

<script>
	import {say} from './speech';
	import {createEventDispatcher} from 'svelte';
	import Loading from "./Loading.svelte";
	import ExternalLink from "./ExternalLink.svelte";

	let timer;
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

	export let source = '';
	export let term = '';
	$: lookup = getDef(term);
</script>
