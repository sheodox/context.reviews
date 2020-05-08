<script>
	import {say} from './speech';
	import {createEventDispatcher} from 'svelte';
	export let phrase = '';
	export let mode;
	export let forceShowDelete = false;

	const dispatch = createEventDispatcher();
	let visible = true;

	function updateList(list) {
		dispatch('updateList', {list});
	}

	const action = url => fetch(url).then(res => res.json()).then(updateList);
	async function deletePhrase() {
		await action(`remove/${phrase.id}`);
	}
	async function hidePhrase() {
		await action(`hide/${phrase.id}`);
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
	.hide {
		color: #8893a5;
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

{#if mode !== 'review' || phrase.visible}
	<tr>
		<td class="buttons">
			{#if mode === 'delete' || forceShowDelete}
				<button on:click={deletePhrase} class="delete">削除</button>
			{:else if mode === 'review'}
				<button on:click={hidePhrase} class="hide">非表示</button>
			{/if}
			<button on:click={define} class="search">辞書</button>
			<button on:click={read} class="read">音声</button>
		</td>
		<td class="phrase">
			{phrase.phrase}
		</td>
	</tr>
{/if}
