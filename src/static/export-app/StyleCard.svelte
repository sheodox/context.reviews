<style>
	.card {
		border: 2px solid var(--sx-gray-300);
		border-radius: 3px;
	}
	.short {
		width: 3em;
	}
	.medium {
		width: 4em;
	}
	.long {
		width: 6em;
	}
	.front .text-shape {
		height: var(--sx-font-size-7);
	}
	.text-shape {
		height: var(--sx-font-size-4);
	}
	.text-shape.text {
		background: var(--sx-gray-75);
	}
	.text-shape.text-muted {
		background: var(--sx-gray-100);
	}
	.text-shape.highlight-text {
		background: var(--sx-blue-300);
	}
	.short,
	.medium,
	.long {
		border-radius: 5px;
		overflow: hidden;
		margin-right: 1px;
	}
	.line {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-self: start;
	}
</style>

<div class="card m-3 p-3">
	<div class="front f-row justify-content-center">
		{#if variant === 'word'}
			<div class="text-shape highlight-text line short" />
		{:else}
			<div class="line">
				<div class="text-shape text medium" />
				<div class="text-shape highlight-text short" />
				<div class="text-shape text long" />
			</div>
		{/if}
	</div>
	<hr />
	<div class="back f-column gap-1">
		<div class="line">
			<div class="text-shape short text-muted" />
			<div class="text-shape long text" />
		</div>
		<div class="line">
			<div class="text-shape medium text-muted" />
			<div class="text-shape short text" />
		</div>
		<div class="line">
			<div class="text-shape short text-muted" />
			<div class="text-shape long text" />
		</div>
	</div>
</div>

<script lang="ts">
	import type { CardStyle } from '../types/cards';

	export let variant: CardStyle;
</script>
