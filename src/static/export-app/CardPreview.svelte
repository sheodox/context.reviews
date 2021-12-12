<style>
	.demo-reveal {
		display: flex;
		justify-content: center;
	}
	.demo-reveal button {
		flex: 1;
	}
	.demo {
		display: flex;
		flex-direction: column;
		background: var(--shdx-gray-700);
	}
	.demo .card-preview {
		height: 35rem;
		overflow: auto;
	}
	.normal-preview {
		overflow: auto;
	}
</style>

<div class:demo={demoMode} class:normal-preview={!demoMode}>
	<div class="card-preview" bind:this={previewElement} use:mountPreview={card} />
	{#if demoMode && !revealed}
		<div class="demo-reveal">
			<button on:click={demoCardReveal}>Show Answer</button>
		</div>
	{:else if demoMode}
		<div class="demo-reveal">
			<button on:click={demoCardHide}>Again (&lt;1m)</button>
			<button on:click={demoCardHide}>Good (&lt;10m)</button>
			<button on:click={demoCardHide}>Easy (4d)</button>
		</div>
	{/if}
</div>

<script lang="ts">
	import { compileAnkiCard } from './SRSConstructor';
	import { createEventDispatcher } from 'svelte';
	import type { Card } from '../types/cards';

	export let card: Card;
	export let demoMode = false;
	const dispatch = createEventDispatcher<{ 'demo-learned': void }>();
	let previewElement: HTMLElement,
		//if this card is in demo mode (landing page) the 'show answer' button toggles if the back of
		//the card is revealed
		revealed = true;

	function demoCardReveal() {
		revealed = true;
		mountPreview();
	}
	function demoCardHide() {
		revealed = false;
		dispatch('demo-learned');
	}

	/**
	 * Compile the card's markup, and mount it within a shadow DOM to keep styles separate
	 */
	function mountPreview(element = previewElement, crd: Card = card) {
		const [cardFront, cardBack] = compileAnkiCard(crd),
			shadow = element.shadowRoot || element.attachShadow({ mode: 'open' }),
			cardContainer = document.createElement('div');

		cardContainer.style.padding = '1rem';
		cardContainer.classList.add('card');
		cardContainer.innerHTML = `
            ${cardFront}
            <hr>
            <div class="back">
                ${cardBack}
            </div>

            <style>
                .card {
                    text-align: center;
                }
                p.word {
                    margin: 0;
                }
                ${revealed ? '' : '.back { opacity: 0; pointer-events: none; } '}
            </style>
        `;

		shadow.innerHTML = '';
		shadow.appendChild(cardContainer);
		//can't set target=_blank in the template or Anki won't open it,
		//but we don't want someone to accidentally open it and lose progress (there is a confirm, but don't want to risk it)
		cardContainer.querySelectorAll('a').forEach((anchor) => {
			anchor.setAttribute('target', '_blank');
			anchor.setAttribute('rel', 'noreferrer noopener');
		});

		return {
			update() {
				mountPreview(element);
			},
		};
	}
</script>
