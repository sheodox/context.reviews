<style>
    section {
		margin: 1rem;
		max-width: 30rem;
	}
	textarea {
		height: 10rem;
		width: 100%;
		resize: vertical;
		font-size: 0.8rem;
	}
	form {
		display: flex;
		flex-direction: column;
	}
    form button {
		align-self: end;
	}
</style>

<section>
	<p>
		You can paste text in bulk here to be imported. It will will be split into individual sentences between punctuation and line breaks.
	</p>
	<form on:submit|preventDefault={addPhrases}>
		<label for="bulk-phrase-add-input">
			Phrases
		</label>
		<br>
		<textarea id="bulk-phrase-add-input" bind:value={phraseText}></textarea>
		<br>
		<button disabled={!phraseText || submitting}><Icon icon="add" />Add</button>
	</form>

	<small>
		<Icon icon="info" />
		Hint: If you're using the Context.Reviews browser extension (install links can be found on the Help dialog) your Jisho searches will automatically appear here, but you can always use this to add phrases by hand or in bulk.
	</small>
</section>

<script>
    import Icon from '../Icon.svelte';
    export let showAddDialog = true;

    let phraseText = '',
		submitting = false;

    async function addPhrases() {
    	submitting = true;
		// use a POST, because a GET might make an overly long URL
        await fetch(`/phrases/add`, {
        	method: 'POST',
            headers: {
        		'Content-Type': 'application/json',
			},
			body: JSON.stringify({phraseText})
		});
        submitting = false;
		showAddDialog = false;
	}
</script>