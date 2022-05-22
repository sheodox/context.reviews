<style>
	.editor {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.preview-column,
	.edit-column {
		flex: 1;
		min-width: 30rem;
	}
	.add-meaning {
		width: 100%;
	}
	.editor :global(input) {
		font-size: 0.9rem;
	}
	.meaning-header {
		padding-top: var(--sx-spacing-2);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.meaning-header button {
		align-self: center;
		padding: 0.3rem;
	}
	.header {
		padding-top: var(--sx-spacing-2);
	}
	h3 {
		margin: 0;
		align-self: center;
	}
	.side-by-side-fields {
		display: flex;
		gap: var(--sx-spacing-3);
	}
	.card-preview {
		overflow: hidden;
		border-radius: 0.3rem;
	}
	.sub-panel {
		background: var(--sx-gray-600);
		margin: 0;
	}
	textarea {
		width: 100%;
		resize: vertical;
	}
</style>

<div class="editor gap-4 mt-4">
	<div class="edit-column">
		<div class="mb-4">
			<TabList bind:selectedTab {tabs} />
		</div>
		<Tab tabId="meanings" {selectedTab}>
			<div class="gap-4 f-column">
				{#each meanings as meaning, index}
					<div class="sub-panel f-column gap-3">
						<div class="meaning-header">
							<h3>Meaning {index + 1}</h3>
							<button on:click={() => removeMeaning(meaning)}>
								<Icon icon="times" />
								Remove
							</button>
						</div>
						<TextInput bind:value={meaning.definition} id={`meaning-definition-${index}`}>Meaning</TextInput>
						<div class="side-by-side-fields">
							<TextInput bind:value={meaning.preInfo} id={`meaning-definition-${index}`}>Part of speech</TextInput>
							<TextInput bind:value={meaning.info} id={`meaning-definition-${index}`}>Extra notes</TextInput>
						</div>
					</div>
				{/each}
				<button on:click={addMeaning} class="add-meaning">
					<Icon icon="plus" />
					Add meaning
				</button>
			</div>
		</Tab>
		<Tab tabId="metadata" {selectedTab}>
			<div class="sub-panel f-column gap-3">
				<div class="header">
					<h3>Metadata</h3>
				</div>
				<div class="side-by-side-fields">
					<TextInput bind:value={$definition.word} id="definition-editor-word">Dictionary form word</TextInput>
					<TextInput bind:value={$definition.reading} id="definition-editor-reading">Dictionary form reading</TextInput>
				</div>
				<div class="side-by-side-fields">
					<TextInput bind:value={$source} id="definition-editor-source">Source</TextInput>
					<TextInput bind:value={$definition.href} id="definition-editor-source" placeholder="https://..."
						>Source URL</TextInput
					>
				</div>
				<EditTags bind:tags={$definition.tags} />
			</div>
		</Tab>
		<Tab tabId="notes" {selectedTab}>
			<div class="f-column gap-3">
				<label>
					Notes before definition
					<br />
					<textarea bind:value={$beforeNotes} />
				</label>
				<br />
				<label>
					Notes after definition
					<br />
					<textarea bind:value={$afterNotes} />
				</label>
			</div>
		</Tab>
	</div>
	<div class="preview-column">
		<div class="sub-panel">
			<div class="header">
				<h3>Preview</h3>
			</div>
			<div class="card-preview">
				<CardPreview card={$card} />
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { Icon, TextInput, TabList, Tab } from 'sheodox-ui';
	import CardPreview from './CardPreview.svelte';
	import EditTags from './EditTags.svelte';
	import { card, source, definition, beforeNotes, afterNotes } from '../stores/current-card';
	import type { Meaning } from '../../shared/types/definitions';

	export let meanings: Meaning[] = [blankMeaning()];

	let selectedTab: string;

	const tabs = [
		{
			id: 'meanings',
			title: 'Meanings',
		},
		{
			id: 'metadata',
			title: 'Metadata',
		},
		{
			id: 'notes',
			title: 'Notes',
		},
	];

	function blankMeaning(): Meaning {
		return {
			preInfo: '',
			definition: '',
			info: '',
			//not yet editable, but depended on by the preview
			seeAlso: [],
			links: [],
		};
	}

	function addMeaning() {
		definition.update((definition) => {
			definition.meanings.push(blankMeaning());
			return definition;
		});
	}

	function removeMeaning(meaning: Meaning) {
		definition.update((definition) => {
			const meaningIndex = definition.meanings.indexOf(meaning);
			if (meaningIndex >= 0) {
				definition.meanings.splice(meaningIndex, 1);
			}
			return definition;
		});
	}
</script>
