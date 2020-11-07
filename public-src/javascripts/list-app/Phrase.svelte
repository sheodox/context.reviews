<style>
	.delete {
		color: red;
	}
	.search {
		color: #00fca9;
	}
	.read {
		color: #2a83c5;
	}
	.buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
	button {
		white-space: nowrap;
		padding: 0.4rem;
	}
	.phrase {
		font-size: 1.3rem;
	}
	@media (max-width: 950px) {
		.buttons {
			flex-direction: column;
		}
	}
</style>

<tr>
	<td class="buttons">
		<CollapsingButtons collapseBreakpoint={950}>
			<button on:click={deletePhrase} class="delete">
				Delete
			</button>
			<button on:click={define} class="search">Jisho</button>
			{#if $settings.speechSynthesis}
				<button on:click={read} class="read">Say</button>
			{/if}
		</CollapsingButtons>
	</td>
	<td class="phrase jp">
		<SelectableText text={phrase.phrase} on:text-select />
	</td>
</tr>

<script>
	import {say} from '../speech';
	import phraseStore from '../phraseStore';
	import SelectableText from "../SelectableText.svelte";
	import CollapsingButtons from '../CollapsingButtons.svelte';
	import {settings} from "../metadataStore";
	import {Icon} from 'sheodox-ui';

	export let phrase = '';

	let visible = true;

	async function deletePhrase() {
		await phraseStore.action(`remove/${phrase.id}`);
	}

	function define() {
		window.open(`https://jisho.org/search/${encodeURIComponent(phrase.phrase)}`);
	}

	function read() {
		say(phrase.phrase);
	}
</script>
