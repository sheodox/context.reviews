<script>
	import {say} from './speech';
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

{#await lookup then result}
	{#if result}
		<div class="definition">
			<h1>{source}</h1>
			{#each result.data as meaning}
				<h3>
					{#if meaning.word === 'No results'}
						<p>{meaning.word}</p>
					{:else}
						<a target=_blank rel="noopener noreferrer" href={meaning.href}>{meaning.word}</a>
					{/if}
					<button on:click={() => say(meaning.word)} class="read">音声</button>
				</h3>
				{#if meaning.reading}
					<h4>- ({meaning.reading})</h4>
                    <button on:click={() => say(meaning.reading)} class="read">音声</button>
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
