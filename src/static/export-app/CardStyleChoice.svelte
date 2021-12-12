<style lang="scss">
	.card-preview {
		font-weight: normal;
		padding: 0.5rem;
	}
	button.style-choice {
		font-weight: normal;
		display: flex;
		flex-direction: column;
		padding: 0;
		position: relative;
		background: var(--shds-gray-600);
		border: 1px solid var(--shdx-blue-600);
		border-radius: 7px;

		$hover-glow: 0 0 1.5rem var(--shdx-blue-700);
		&:hover {
			border-color: var(--shdx-blue-200);
			box-shadow: #{$hover-glow};

			span {
				box-shadow: #{$hover-glow};
			}
		}

		span {
			position: relative;
			align-self: center;
			background: var(--shdx-blue-400);
			color: black;
			padding: var(--shdx-spacing-2);
			font-size: var(--shdx-font-size-6);
			border-radius: 0 0 5px 5px;
		}
	}
	.preview {
		pointer-events: none;
		line-height: 1.4;
	}
	.skeleton {
		display: none;
	}
	@media (max-width: 900px) {
		.card-preview {
			display: none;
		}
		.skeleton {
			display: block;
		}
	}
</style>

<div>
	<p class="text-align-center shdx-font-size-5">Which card front style do you prefer?</p>

	<div class="f-row justify-content-center">
		<button on:click={() => dispatch('cancel')}><Icon icon="times" />Cancel</button>
	</div>

	<div class="f-row justify-content-center">
		<button class="card clickable style-choice" on:click={() => pick('word')}>
			<span>Dictionary Form</span>

			<div aria-hidden="true" class="preview">
				<div class="skeleton">
					<StyleCard variant="word" />
				</div>
				<div class="card-preview">
					<CardPreview card={wordCard} />
				</div>
			</div>
		</button>

		<button class="card clickable style-choice" on:click={() => pick('context')}>
			<span>In Context</span>
			<div aria-hidden="true" class="preview">
				<div class="skeleton">
					<StyleCard variant="context" />
				</div>
				<div class="card-preview">
					<CardPreview card={contextCard} />
				</div>
			</div>
		</button>
	</div>
</div>

<script lang="ts">
	import { Icon } from 'sheodox-ui';
	import { createEventDispatcher } from 'svelte';
	import StyleCard from './StyleCard.svelte';
	import { card } from '../stores/current-card';
	import { cardStyle } from '../stores/cards';
	import CardPreview from './CardPreview.svelte';
	import type { CardStyle } from '../types/cards';

	const dispatch = createEventDispatcher<{ done: void; cancel: void }>();
	$: wordCard = { ...$card, cardStyle: 'word' as CardStyle };
	$: contextCard = { ...$card, cardStyle: 'context' as CardStyle };

	function pick(style: CardStyle) {
		$cardStyle = style;
		dispatch('done');
	}
</script>
