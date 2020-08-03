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
		border:	none;
		background: var(--accent-gradient);
		background-attachment: local;
		height: 0.2rem;
	}
</style>

<form on:submit|preventDefault>
	<input type="text" placeholder="なにかを入力する..." autocomplete="off" on:keyup={onSearchType} bind:value={searchFieldValue} bind:this={searchField} aria-label="definition search"/>
</form>

<DictionarySearchResults {term} source="jisho" isPrimary={true} on:first-word={e => firstWord = e.detail}/>
<hr>
<OtherDictionaryLinks term={firstWord} />

<svelte:window on:keydown={keydown} />

<script>
	import DictionarySearchResults from '../definitions/DictionarySearchResults.svelte';
	import OtherDictionaryLinks from '../definitions/OtherDictionaryLinks.svelte';
	export let term = '';

	const DEBOUNCE_TIMEOUT = 500;
	let searchField,
		//the first word in jisho's search results. this is more likely to be a proper dictionary form than
		//the text that was selected (no conjugations etc that would make searching this word harder in other dictionaries)
		firstWord = '',
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
		if (e.key === 's' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
			e.preventDefault();
			searchField.focus();
			searchField.select();
		}
	}
</script>
