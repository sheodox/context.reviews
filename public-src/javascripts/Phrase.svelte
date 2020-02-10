<script>
	import {say} from './speech';
	import {createEventDispatcher} from 'svelte';
	export let phrase = '';
	const dispatch = createEventDispatcher();

	function updateList(list) {
		dispatch('updateList', {list});
	}

	const action = url => fetch(url).then(res => res.json()).then(updateList);
	async function deletePhrase() {
		await action(`remove/${phrase.id}`);
	}
	function define() {
		window.open(`https:/jisho.org/search/${encodeURIComponent(phrase.phrase)}`);
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
		padding: 0.2rem;
		font-weight: normal;
	}
</style>

<tr>
	<td class="buttons">
		<button on:click={deletePhrase} class="delete">削除</button>
		<button on:click={define} class="search">辞書</button>
		<button on:click={read} class="read">音声</button>
	</td>
    <td>
		{phrase.phrase}
	</td>
</tr>
