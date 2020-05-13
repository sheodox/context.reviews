<script>
	import {say} from './speech';
	import Loading from "./Loading.svelte";

	let timer;
	const getDef = async (phrase) => {
		clearTimeout(timer);
		if (!phrase) {
			return;
		}

		const wait = () => {
			return new Promise(resolve => {
				timer = setTimeout(resolve, 500)
			})
		};

		//debounce searches
		return Promise.resolve()
				.then(wait)
				.then(() => fetch(`lookup/${source}/${encodeURIComponent(phrase)}/`)
						.then(res => res.json()));
	};
	export let source = '';
	export let term = '';
	$: lookup = getDef(term);
</script>

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
    button.read {
		font-size: 0.7rem;
		padding: 0.2rem;
	}
</style>

<div class="definition">
	{#await lookup }
		<h1>{source}</h1>
		<Loading />
	{:then result}
		<h1><a href="{result.href}">{source}</a></h1>
		{#if result.definitions.length > 0}
				{#each result.definitions as definition}
					<h3>
						{#if definition.word === 'No results'}
							<p>{definition.word}</p>
						{:else}
							<a target=_blank rel="noopener noreferrer" href={definition.href}>{definition.word}</a>
						{/if}
						<button on:click={() => say(definition.word)} class="read">音声</button>
					</h3>
					{#if definition.reading}
						<h4>- ({definition.reading})</h4>
						<button on:click={() => say(definition.reading)} class="read">音声</button>
					{/if}

					<ol>
						{#each definition.meanings as meaning}
							<li>{meaning.definition} <span class="info">{meaning.info || ''}</span></li>
						{/each}
					</ol>
				{/each}
		{:else}
			<p>No results found for "{term}"</p>
		{/if}
	{/await}
</div>
