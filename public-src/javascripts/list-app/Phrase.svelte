<script>
	import {say} from '../speech';
	import phraseStore from '../phraseStore';
	import SelectableText from "../SelectableText.svelte";

	export let phrase = '';

	let visible = true;

	async function deletePhrase() {
		await phraseStore.action(`remove/${phrase.phrase_id}`);
	}

	async function hidePhrase() {
		await phraseStore.action(`hide/${phrase.phrase_id}`);
	}

	function define() {
		window.open(`https://jisho.org/search/${encodeURIComponent(phrase.phrase)}`);
	}

	function read() {
		say(phrase.phrase);
	}
</script>

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
		font-weight: normal;
	}
	.phrase {
		font-size: 1.3rem;
	}
</style>

<tr>
	<td class="buttons">
		<button on:click={deletePhrase} class="delete">削除</button>
		<button on:click={define} class="search">辞書</button>
		<button on:click={read} class="read">音声</button>
	</td>
	<td class="phrase">
		<SelectableText text={phrase.phrase} on:text-select />
	</td>
</tr>
