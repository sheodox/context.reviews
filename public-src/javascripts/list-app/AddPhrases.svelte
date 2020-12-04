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
	.check {
		padding: 0.5rem;
	}
	.recommended {
		text-align: center;
		color: var(--primary);
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
		<label class="check">
			<input type="checkbox" bind:checked={splitOnSpaces}>
			Add space separated text as individual phrases <span class="muted">(use this if you have a bunch of vocab separated only by spaces)</span>
		</label>
		{#if recommendSplitting && !splitOnSpaces}
			<p class="recommended">
				<Icon icon="hat-wizard" />
				This is a really long phrase, you might want to check the above option or it'll be unwieldy when exporting.
			</p>
		{/if}
		<br>
		<button disabled={!phraseText || submitting}><Icon icon="plus" />Add</button>
	</form>

	<small>
		<Icon icon="info" />
		Hint: If you're using the Context.Reviews browser extension (install links can be found on the Help dialog) your Jisho searches will automatically appear here, but you can always use this to add phrases by hand or in bulk.
	</small>
</section>

<script>
    import {Icon} from 'sheodox-ui';
	import {createHttpErrorToast} from "../http-error-toasts";
    export let showAddDialog = true;

    let phraseText = '',
		splitOnSpaces = false,
		submitting = false;

    $: recommendSplitting = phraseText.length > 100 && !/[。！？\n]/.test(phraseText);

    async function addPhrases() {
    	submitting = true;

		//by turning spaces into newlines the backend will treat them as individual spaces
		const phrases = !splitOnSpaces ? phraseText : phraseText.replace(/\s+/g, '\n'),
			// use a POST, because a GET might make an overly long URL
			response = await fetch(`/phrases/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({phraseText: phrases})
			});

		submitting = false;
		if (response.ok) {
			showAddDialog = false;
		}
		else {
			await createHttpErrorToast('An error occurred adding phrases.', response);
		}
	}
</script>