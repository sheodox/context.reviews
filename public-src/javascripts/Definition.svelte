<script>
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
</style>

{#await lookup then result}
	{#if result}
		<div class="definition">
			<h1>{source}</h1>
			{#each result.data as meaning}
				<h3>
					{#if meaning.word === 'No results'}
						<h3>{meaning.word}</h3>
					{:else}
						<a target=_blank rel="noopener noreferrer" href={`https://jisho.org/search/${encodeURIComponent(meaning.word)}`}>{meaning.word}</a>
					{/if}
				</h3>
				{#if meaning.reading}
					<h4>- ({meaning.reading})</h4>
				{/if}

				<ol>
					{#each meaning.definitions as definition}
						<li>{definition.definition} <span class="info">{definition.info || ''}</span></li>
					{/each}
				</ol>
			{/each}
		</div>
	{/if}
{/await}
