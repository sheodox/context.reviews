<style>
    ul {
        padding: 0;
        list-style: none;
    }
    div {
        padding: 0.5rem;
    }
    h1 {
        margin: 0;
        text-align: center;
    }
	.hint-text {
		text-align: center;
	}
</style>

<div>
    <h1>Other Dictionaries</h1>

    {#if term}
        {#each [term] as term (term)}
            <div in:fly={{y: 50}}>
				<p>View results for <span class="jp">"{term}"</span> in other dictionaries</p>

                <ul>
					{#each links as {siteName, href}}
						<li>
							<ExternalLink href={href}>{siteName}</ExternalLink>
						</li>
					{/each}
				</ul>
			</div>
        {/each}
    {:else}
		<p class="hint-text">Search for something to see links to definitions in other dictionaries.</p>
    {/if}
</div>

<script>
    import {fly} from 'svelte/transition';
    import {createLinks} from './otherDictionaryLinks';
    import ExternalLink from '../ExternalLink.svelte';
    export let term = '';

    $: links = createLinks(term);
</script>