<style>
	span::selection {
		border-radius: 3px;
		background: var(--shdx-blue-300);
		color: black;
	}
</style>

<!-- use mouseup to short circuit the selectionchange debounce -->
<span bind:this={textElement} on:mouseup={onSelection} class="jp">
	{text}
</span>

<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	export let text = '';

	const dispatch = createEventDispatcher<{
			'text-select': {
				text: string;
				range: [number, number];
			};
		}>(),
		SELECTION_DEBOUNCE_TIMEOUT = 700;
	let textElement: HTMLElement, selectionDebounce: ReturnType<typeof setTimeout>;

	function debounceSelection() {
		//debounce selections, this otherwise runs for every extra character selected
		clearTimeout(selectionDebounce);
		selectionDebounce = setTimeout(onSelection, SELECTION_DEBOUNCE_TIMEOUT);
	}

	function onSelection() {
		//don't double select if mouseup happened but we were waiting to debounce
		clearTimeout(selectionDebounce);

		const sel = window.getSelection(),
			selectionText = sel.toString(),
			ranges = [sel.focusOffset, sel.anchorOffset],
			hasSelection = ranges[0] !== ranges[1];

		//need to make sure textElement exists, when lots of clicking is done (lots of deleting phrases on the list,
		//or clicking 'next phrase' in the export app quickly) textElement can be nulled out. also need to make sure we're selecting
		//something, and we know the range. sometimes when selecting text at the front of the phrase (like by double clicking
		//the first word in a phrase) it'll give a (0, 0) range even though something is selected, ignore that or it'll clear good ranges
		if (
			textElement &&
			hasSelection &&
			[sel.anchorNode, sel.focusNode].every((node) => textElement.contains(node)) &&
			selectionText
		) {
			dispatch('text-select', {
				text: selectionText.trim(),
				range: [Math.min(...ranges), Math.max(...ranges)],
			});
		}
	}

	onMount(() => {
		document.addEventListener('selectionchange', debounceSelection);
	});
	onDestroy(() => {
		document.removeEventListener('selectionchange', debounceSelection);
	});
</script>
