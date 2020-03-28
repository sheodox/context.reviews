<style>
	#definitions {
		background-color: #151d29;
		position: fixed;
		width: 25%;
        right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
	}
    form {
		flex: 0;
		display: flex;
		flex-direction: row;
	}
	form input[type=text] {
		margin: 0;
		flex: 1;
	}
	form input[type=submit] {
		flex: 0;
        margin: 0;
	}
    hr {
		width: 100%;
		border:	3px solid #2a83c5;
	}
</style>

<aside id="definitions">
	<form on:submit|preventDefault>
		<input type="text" placeholder="なにかを入力する..." autocomplete="off" bind:value={term} bind:this={searchField}/>
		<input type="submit" value="検索">
	</form>
	{#if term}
		<Definition {term} source="jisho"/>
		<hr>
		<Definition {term} source="goo"/>
	{/if}
</aside>

<svelte:window on:keydown={keydown} />

<script>
	import Definition from './Definition.svelte';
	let searchField;

	export let term = '';
	function keydown(e) {
		if (e.key === 's' && e.target.tagName !== 'INPUT') {
			e.preventDefault();
			searchField.focus();
			searchField.select();
		}
	}
</script>
