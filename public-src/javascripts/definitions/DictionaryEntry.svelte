<style>
	h2 {
		display: inline;
	}
	.info {
		color: gray;
	}
	button.small {
		font-size: 0.7rem;
		padding: 0.2rem;
	}

	.see-also {
		color: var(--shdx-blue-500);
	}

	.word {
		color: var(--shdx-blue-500);
	}

	ol {
		margin-top: 0.2rem;
	}
	.alternate-forms {
		color: #8293a1;
		margin-left: 1rem;
	}
	.alternate-forms :global(ruby:not(:first-of-type)) {
		margin-left: 0.5rem;
	}
	.selected {
		background: var(--shdx-accent-gradient);
		border-radius: 0.2rem;
	}
	.word-container.selectable {
		padding: 0.2rem;
	}
	.selected .search-result {
		background: var(--shdx-gray-700);
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
</style>
<div class="word-container" class:selected={isWordSelected($card.id)} class:selectable={mode === 'export'}>
	<div class="search-result">
		<div class="title">
			<h2 class="japanese has-inline-links">
				<ExternalLink href={definition.href}>
					<JapaneseWord
						word={definition.word}
						reading={definition.reading}
						wordComparison={searchTerm}
						readingComparison={searchTerm}
					/>
				</ExternalLink>
			</h2>
			{#each (analyzeTags(definition.tags || [])) as {text, styles}}
				<Tag text={text} styles={styles} />
			{/each}
		</div>
		<p class="selected-definition-message">Selected Definition</p>

		{#if mode === 'list'}
			<button class="small primary" on:click={() => addToReviews(definition.word)}>+ Add to phrases</button>
		{:else}
			<button
				class="small"
				class:primary={definition.word === searchTerm}
				on:click={() => selectForExport()}
				disabled={isFormSelected($card, definition.word, definition.reading)}
			>
				{#if definition.word === searchTerm}
					<Icon noPadding={true} icon="hat-wizard" />
				{/if}
				Select
			</button>
		{/if}

		{#if $settings.speechSynthesis}
			<button on:click={() => say(definition.word)} class="small">Say word</button>
			{#if definition.reading}
				<button on:click={() => say(definition.reading)} class="small">Say reading</button>
			{/if}
		{/if}

		{#if mode === 'export' && isWordSelected($card.id)}
			<button on:click={() => dispatch('editDefinition')} class="small">Customize Card</button>
		{/if}
		<ol>
			{#each definition.meanings as meaning}
				<li class="has-inline-links">
					{#if meaning.preInfo}
						<small class="info">{meaning.preInfo}</small>
						<br>
					{/if}

					{meaning.definition}
					<small class="info">{meaning.info || ''}</small>

					{#if meaning.seeAlso.length > 0}
						<br>
						{#each meaning.seeAlso as also}
							<button class="small see-also" on:click={() => searchTerm = also}>See also <span class="jp">{also}</span></button>
						{/each}
					{/if}

					{#if meaning.links.length > 0}
						{#each meaning.links as {text, url}}
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
				{#each definition.alternateForms as alt, index}
					{#if mode === 'export'}
						<button
							class="small word"
							on:click={() => selectForExport(alt)}
							disabled={isFormSelected($card, alt.word, alt.reading)}
						>
							<JapaneseWord
								word={alt.word}
								reading={alt.reading}
								wordComparison={searchTerm}
								readingComparison={definition.reading}
							/>
						</button>
					{:else}
						<JapaneseWord word={alt.word} reading={alt.reading} />
					{/if}

					{#if index + 1 < definition.alternateForms.length}
						<span>, </span>
					{/if}
				{/each}
			</p>
		{/if}
	</div>
</div>
<script>
	import {createEventDispatcher} from 'svelte';
	import {say} from '../speech';
	import Tag from './Tag.svelte';
	import ExternalLink from "../ExternalLink.svelte";
	import JapaneseWord from './JapaneseWord.svelte';
	import phraseStore from '../phraseStore';
	import {settings} from '../metadataStore';
	import {
		selectDefinition,
        card,
	} from '../export-app/currentCardStore';
	import {Icon} from 'sheodox-ui';
	import {analyzeTags} from './processTag';

	//the dictionary site this came from
	export let source = '';
	//'list' (main homepage), or 'export' (exporting to anki)
	export let mode = 'list';
	//the definition being rendered here
	export let definition = {};
	//what was searched for, in export mode this can show an indicator of which forms match the search exactly
	//to make it easier to find an alternate form that matches the kanji
	export let searchTerm = '';

	const dispatch = createEventDispatcher(),
		cloneObject = obj => JSON.parse(JSON.stringify(obj));

	function selectForExport(alternate) {
		selectDefinition(source, definition, alternate);
	}

	function isWordSelected(cardId) {
		return mode === 'export' && definition.href === cardId;
	}

	function isFormSelected(card, word, reading) {
		return card.id === definition.href &&
			card.word === word &&
            //some jisho, and all goo definitions don't have a reading, but the card will always have a reading
			//without ignoring that we'll never identify the form as being selected for those instances
			(!reading || card.reading === reading);
	}

	function addToReviews(word) {
		phraseStore.action(`add/${encodeURIComponent(word)}`)
	}
</script>
