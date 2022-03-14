<style lang="scss">
	.phrase {
		display: flex;
		padding: 0.5rem;
		border-radius: 5px;
		gap: 0.5rem;

		&:hover {
			background-color: var(--contextreviews-background-light);
		}
	}
	button {
		width: 5rem;
	}
	.phrase-text {
		flex: 1;
		align-self: center;
	}
	.phrase.deleted .phrase-text {
		color: #647b93;
	}
	.status {
		$size: 0.7rem;
		width: $size;
		height: $size;
		border-radius: 50%;
		align-self: center;
		color: black;
		font-size: 0.6rem;
		font-weight: bold;
		text-align: center;
		cursor: help;

		&.prompt {
			background-color: hsl(46, 100%, 55%);
		}
		&.deleted {
			background-color: hsl(0, 75%, 60%);
		}
		&.added {
			background-color: hsl(200, 100%, 55%);
		}
	}
</style>

<div class="phrase {phrase.status}">
	<div class="status {phrase.status}" {title} />
	<div class="phrase-text">
		{phrase.phrase}
	</div>

	{#if phrase.status === 'prompt' || phrase.status === 'deleted'}
		<button on:click={() => record([phrase.phrase])}>Save</button>
	{:else if phrase.status === 'added'}
		<button on:click={() => remove(phrase)}>Delete</button>
	{/if}
</div>

<script lang="ts">
	import { Phrase, record, remove } from '../extension-utils';

	export let phrase: Phrase;
	$: title = getTitle(phrase.status);

	function getTitle(status: string) {
		switch (status) {
			case 'added':
				return 'This phrase has been saved';
			case 'deleted':
				return 'This phrase has been deleted';
			case 'prompt':
				return 'Do you want to save this phrase?';
		}
	}
</script>
