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
</style>

<div>
    <h1>Other Dictionaries</h1>

    {#if term}
        {#each [term] as term (term)}
            <div in:fly={{y: 50}}>
                <p>View results for "{term}" in other dictionaries</p>

                <ul>
                    <li>
                        <ExternalLink href="http://eow.alc.co.jp/search?q={encoded}">ALC</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://dictionary.goo.ne.jp/srch/all/{encoded}/m0u/">Goo 辞書</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://kotobank.jp/gs/?q={encoded}">Kotobank</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://www.sanseido.biz/User/Dic/Index.aspx?DORDER=&DailyEJ=checkbox&DailyJE=checkbox&DailyJJ=checkbox&TWords={encoded}&st=0">Sanseido</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://www.weblio.jp/content/{encoded}">Weblio</ExternalLink>
                    </li>
					<li>
						<ExternalLink href="https://www.google.com/search?q={encoded}">Google</ExternalLink>
					</li>
					<li>
						<ExternalLink href="https://www.google.com/search?q={encoded}&tbm=isch">Google Images</ExternalLink>
					</li>
				</ul>
			</div>
        {/each}
    {:else}
		<p>Search for something to see links to definitions in other dictionaries.</p>
    {/if}
</div>

<script>
    import {fly} from 'svelte/transition';
    import ExternalLink from '../ExternalLink.svelte';
    export let term = '';
    $: encoded = encodeURIComponent(term);
</script>