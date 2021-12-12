<style>
	ul {
		max-height: 20rem;
		overflow: auto;
		list-style: none;
		padding: 0.5rem;
	}
</style>

<div class="modal-body">
	<p>
		Are you sure you want to delete every context sentence? You haven't made cards for {$unusedPhrases.length}
		{$unusedPhrases.length === 1 ? 'phrase' : 'phrases'}:
	</p>
	<ul>
		{#each $unusedPhrases as phrase}
			<li>{phrase.phrase}</li>
		{/each}
	</ul>
	<div class="buttons f-row justify-content-end">
		<button on:click={() => (visible = false)}> Cancel </button>
		<button on:click={deleteAll} class="danger">
			<Icon icon="trash" />
			Delete All
		</button>
	</div>
</div>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icon } from 'sheodox-ui';
	import { unusedPhrases } from '../stores/cards';

	export let visible: boolean;

	const dispatch = createEventDispatcher<{ 'delete-all': void }>();

	async function deleteAll() {
		dispatch('delete-all');
	}
</script>
