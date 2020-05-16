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
		width: 100%;
	}
    hr {
		width: 100%;
		border:	3px solid #2a83c5;
	}
</style>

<aside id="definitions">
	<form on:submit|preventDefault>
		<input type="text" placeholder="なにかを入力する..." autocomplete="off" on:keyup={onSearchType} bind:value={searchFieldValue} bind:this={searchField} aria-label="definition search"/>
	</form>
	{#if term}
		<Definition {term} source="jisho" isPrimary={true} on:updateList/>
		<hr>
		<Definition {term} source="goo" on:updateList />
	{/if}
</aside>

<svelte:window on:keydown={keydown} />

<script>
	import Definition from './Definition.svelte';
	export let term = '';

	const DEBOUNCE_TIMEOUT = 500;
	let searchField,
		searchFieldValue = '',
		typingDebounce;

	function onSearchType() {
		clearTimeout(typingDebounce);
		typingDebounce = setTimeout(() => {
			term = searchFieldValue;
		}, DEBOUNCE_TIMEOUT)
	}

	$: {
		searchFieldValue = term;
	}

	function keydown(e) {
		if (e.key === 's' && e.target.tagName !== 'INPUT') {
			e.preventDefault();
			searchField.focus();
			searchField.select();
		}
	}
</script>
