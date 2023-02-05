<style>
	h2 {
		display: inline;
	}
	.info {
		color: var(--sx-gray-100);
	}
	button.small {
		font-size: 0.7rem;
		padding: 0.2rem;
	}
	button:not(.small) {
		padding: var(--sx-spacing-2);
	}

	.see-also {
		color: var(--sx-blue-500);
	}

	.word {
		color: var(--sx-blue-500);
	}

	ol {
		margin-top: 0.2rem;
	}
	.alternate-forms {
		color: var(--sx-gray-100);
		margin-left: 1rem;
	}
	.alternate-forms :global(ruby:not(:first-of-type)) {
		margin-left: 0.5rem;
	}
	.selected {
		background: var(--sx-accent-gradient);
		border-radius: 0.2rem;
	}
	.word-container.selectable {
		padding: 0.2rem;
	}
	.selected .search-result {
		background: var(--sx-gray-700);
	}
	.search-result {
		padding: 0.3rem;
		border-radius: 3px;
		position: relative;
	}
	.selected-definition-message {
		display: none;
		position: absolute;
		right: 0;
		top: 0;
		margin: 0;
		padding: 0.2rem;
		background: black;
		opacity: 0.4;
		border-radius: 0.2rem;
	}
	.selected .selected-definition-message {
		display: block;
	}
	.recommended:enabled {
		color: var(--sx-primary);
	}
</style>

<div class="word-container" class:selected={isWordSelected($card.id)} class:selectable={mode === 'export'}>
	<div class="search-result">
		<div class="title">
			<h2 class="japanese has-inline-links">
				<ExternalLink href={definition.href}>
					<JapaneseWord word={definition.word} reading={definition.reading} wordComparison={searchTerm} />
				</ExternalLink>
			</h2>
			{#each analyzeTags(definition.tags || []) as { text, styles }}
				<Tag {text} {styles} />
			{/each}
		</div>
		<p class="selected-definition-message">Selected Definition</p>

		{#if mode === 'list'}
			<button class="primary" disabled={wordIsInPhrases} on:click={() => addToReviews(definition.word)}
				>+ Add to phrases</button
			>
		{:else}
			<button
				class="primary"
				class:recommended={definition.word === searchTerm}
				on:click={() => selectForExport()}
				disabled={isFormSelected($card, definition.word, definition.reading)}
			>
				{#if definition.word === searchTerm}
					<Icon variant="icon-only" icon="hat-wizard" />
				{/if}
				Select
			</button>
		{/if}

		{#if $settings.speechSynthesis}
			<button on:click={() => say(definition.word)}>Say word</button>
			{#if definition.reading}
				<button on:click={() => say(definition.reading)}>Say reading</button>
			{/if}
		{/if}

		<ol>
			{#each definition.meanings as meaning}
				<li class="has-inline-links">
					{#if meaning.preInfo}
						<small class="info">{meaning.preInfo}</small>
						<br />
					{/if}

					{meaning.definition}
					<small class="info">{meaning.info || ''}</small>

					{#if meaning.seeAlso.length > 0}
						<br />
						{#each meaning.seeAlso as also}
							<button class="small see-also" on:click={() => (searchTerm = also)}
								>See also <span class="jp">{also}</span></button
							>
						{/each}
					{/if}

					{#if meaning.links.length > 0}
						{#each meaning.links as { text, url }}
							<br />
							<ExternalLink href={url}>{text}</ExternalLink>
						{/each}
					{/if}
				</li>
			{/each}
		</ol>
		{#if definition.alternateForms && definition.alternateForms.length > 0}
			<p class="alternate-forms">
				Alternates:
				{#each definition.alternateForms as alt}
					{#if mode === 'export'}
						<button
							class="word"
							on:click={() => selectForExport(alt)}
							disabled={isFormSelected($card, alt.word, alt.reading)}
						>
							<JapaneseWord word={alt.word} reading={alt.reading} wordComparison={searchTerm} />
						</button>
					{:else}
						<JapaneseWord word={alt.word} reading={alt.reading} />
					{/if}
				{/each}
			</p>
		{/if}
	</div>
</div>

<script lang="ts">
	import { say } from '../speech';
	import Tag from './Tag.svelte';
	import ExternalLink from '../ExternalLink.svelte';
	import JapaneseWord from './JapaneseWord.svelte';
	import phraseStore from '../stores/phrases';
	import { settings } from '../stores/metadata';
	import { selectDefinition, card } from '../stores/current-card';
	import { Icon } from 'sheodox-ui';
	import { analyzeTags } from './process-tag';
	import type { Definition, JapaneseForm } from '../../shared/types/definitions';
	import type { Card } from '../types/cards';

	//the dictionary site this came from
	export let source = '';
	//'list' (main homepage), or 'export' (exporting to anki)
	export let mode = 'list';
	//the definition being rendered here
	export let definition: Definition;
	//what was searched for, in export mode this can show an indicator of which forms match the search exactly
	//to make it easier to find an alternate form that matches the kanji
	export let searchTerm = '';

	$: wordIsInPhrases = $phraseStore.some(({ phrase }) => phrase === definition.word);

	function selectForExport(alternate?: JapaneseForm) {
		selectDefinition(source, definition, alternate);
	}

	function isWordSelected(cardId: string) {
		return mode === 'export' && definition.href === cardId;
	}

	function isFormSelected(card: Card, word: string, reading: string) {
		return (
			card.id === definition.href &&
			card.word === word &&
			//some jisho, and all goo definitions don't have a reading, but the card will always have a reading
			//without ignoring that we'll never identify the form as being selected for those instances
			(!reading || card.reading === reading)
		);
	}

	function addToReviews(word: string) {
		phraseStore.action(`add/${encodeURIComponent(word)}`);
	}
</script>
