<style lang="scss">
	.column {
		display: flex;
		flex-direction: column;
	}
	.edit-card {
		background: var(--shdx-gray-600);
		border-radius: 5px;
		align-self: center;
		box-shadow: var(--shdx-shadow-5);

		button {
			white-space: nowrap;
		}
		.card-fields {
			align-items: end;
		}
	}
	.card-errors {
		justify-content: center;
	}
	.card-errors p {
		font-size: 0.9rem;
		border-radius: 3px;
	}
	.suggested:enabled {
		color: var(--shdx-primary);
	}
	@media (max-width: 850px) {
		.edit-card .card-fields {
			flex-direction: column;
			align-items: start;
		}
	}
</style>

<div class="centered edit-card mt-4 mr-4 ml-4">
	<div class="f-row card-fields gap-3 m-3">
		<div class="column">
			<TextInput id="edit-word" bind:value={$word}>
				Word
				<button
					slot="append"
					on:click={() => word.set($reading)}
					title={$useKanaTooltip}
					class:suggested={$suggestUseKana}
					disabled={$word === $reading}
				>
					{#if $suggestUseKana}
						<Icon icon="hat-wizard" />
					{/if}
					Use Kana
				</button>
			</TextInput>
		</div>

		<div class="column">
			<TextInput id="edit-reading" bind:value={$reading}>Reading</TextInput>
		</div>

		<div class="column">
			<button
				on:click={() => dispatch('confirm')}
				class="primary"
				disabled={!$word || !$wordIsUnique || isSelectingStyle}
			>
				<Icon icon="plus" />
				Add Card
			</button>
		</div>
		<div class="column">
			<button on:click={() => dispatch('customize')} title="Customize" disabled={isCustomizing}>
				<Icon icon="cog" />
				<span class="sr-only">Customize</span>
			</button>
		</div>
	</div>
	<div class="f-row card-errors">
		{#if !$wordIsUnique}
			<p class="shdx-badge-red m-3 p-1">
				<Icon icon="exclamation-circle" />A card has already been created for this word.
			</p>
		{/if}
	</div>
</div>

<script lang="ts">
	import { TextInput, Icon } from 'sheodox-ui';
	import { createEventDispatcher } from 'svelte';
	import { reading, word, wordIsUnique, suggestUseKana, useKanaTooltip } from '../stores/current-card';

	export let isSelectingStyle: boolean;
	export let isCustomizing: boolean;

	const dispatch = createEventDispatcher<{
		confirm: void;
		customize: void;
	}>();
</script>
