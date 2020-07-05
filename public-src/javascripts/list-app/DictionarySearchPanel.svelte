<style>
    form {
		flex: 0;
		display: flex;
		flex-direction: row;
	}
	form input[type=text] {
		width: 100%;
		margin: 0.5rem;
	}
    hr {
		width: 100%;
		border:	3px solid #2a83c5;
	}
</style>

<form on:submit|preventDefault>
	<input type="text" placeholder="なにかを入力する..." autocomplete="off" on:keyup={onSearchType} bind:value={searchFieldValue} bind:this={searchField} aria-label="definition search"/>
</form>

<DictionarySearchResults {term} source="jisho" isPrimary={true} />
<hr>
<DictionarySearchResults {term} source="goo" />

<svelte:window on:keydown={keydown} />

<script>
	import DictionarySearchResults from '../definitions/DictionarySearchResults.svelte';
	export let term = '';

	const DEBOUNCE_TIMEOUT = 500;
	let searchField,
		searchFieldValue = '',
		lastKeyPressed = '',
		lastKeyTime = 0,
		typingDebounce;

	function onSearchType(e) {
		//if escape was pressed twice in a row quickly, it's the clear field shortcut
		if (e.key === 'Escape' && lastKeyPressed === 'Escape' && Date.now () - lastKeyTime < 500) {
			term = '';
		}
		lastKeyTime = Date.now();
		lastKeyPressed = e.key;

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
