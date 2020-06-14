<style>
    .editor {
        display: flex;
        flex-direction: row;
    }
	.preview-column, .meanings {
		flex: 1;
	}
	input {
		width: 100%;
	}
	.add-meaning {
		width: 100%;
	}
	.editor :global(input) {
		font-size: 0.9rem;
	}
	.meaning-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.meaning-header button {
		align-self: center;
        padding: 0.3rem;
	}
	.meaning {
		margin: 1rem 1rem 2rem;
		background: var(--panel-header-bg);
		padding: 0.5rem;
		border-radius: 0.2rem;
	}
	.header {
		padding: 0.5rem;
	}
	h3 {
		margin: 0;
		align-self: center;
	}
	.side-by-side-fields {
		display: flex;
	}
	.side-by-side-fields > label:first-child {
		margin-right: 0.2rem;
	}
	.side-by-side-fields label {
		flex: 1;
	}
    .card-preview {
		margin-top: 1rem;
		overflow: hidden;
		border-radius: 0.3rem;
	}
	.preview-column {
		margin: 1rem;
	}
	.preview-column .header:not(:first-child) {
		margin-top: 2rem;
	}
</style>

<div class="editor">
	<div class="meanings">
		{#each meanings as meaning, index}
			<div class="meaning">
				<div class="meaning-header">
					<h3>Meaning {index + 1}</h3>
					<button on:click={() => removeMeaning(meaning)}>
						<Icon icon="clear" />
						Remove
					</button>
				</div>
				<label>
					Meaning
					<br>
					<input bind:value={meaning.definition} />
				</label>
				<div class="side-by-side-fields">
					<label>
						Part of speech
						<br>
						<input bind:value={meaning.preInfo} />
					</label>
					<label>
						Extra notes
						<br>
						<input bind:value={meaning.info} />
					</label>
				</div>
			</div>
		{/each}
		<button on:click={addMeaning} class="add-meaning">
			<Icon icon="add" />
			Add meaning
		</button>
	</div>
	<div class="preview-column">
		<div class="header">
			<h3>Metadata</h3>
		</div>
		<div class="side-by-side-fields">
			<label>
				Source
				<input bind:value={$source} />
			</label>
			<label>
				Source URL
				<input bind:value={$definition.href} placeholder="https://..."/>
			</label>
		</div>
		<EditTags bind:tags={$definition.tags} />

		<div class="header">
			<h3>Preview</h3>
		</div>
		<div class="card-preview">
			<CardPreview card={$card} />
		</div>
	</div>
</div>

<script>
	import Icon from '../Icon.svelte';
	import CardPreview from './CardPreview.svelte';
	import EditTags from './EditTags.svelte';
	import {
		card,
		source,
		definition,
	} from './currentCardStore';

	export let meanings = [blankMeaning()];

	function blankMeaning() {
		return {
			preInfo: '',
			definition: '',
			info: ''
		};
	}

	function addMeaning() {
		definition.update(definition => {
			definition.meanings.push(blankMeaning());
			return definition;
		});
	}

	function removeMeaning(meaning) {
		definition.update(definition => {
			const meaningIndex = definition.meanings.indexOf(meaning);
			if (meaningIndex >= 0) {
				definition.meanings.splice(meaningIndex, 1);
			}
			return definition;
		})
	}
</script>