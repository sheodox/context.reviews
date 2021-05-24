<style>
    mark, span::selection {
        border-radius: 3px;
        background: var(--shdx-cyan-200);
        color: var(--shdx-cyan-800);
    }
</style>

<!-- use mouseup to short circuit the selectionchange debounce -->
<span bind:this={textElement} on:mouseup={onSelection} on:mousedown|capture={cancelPreviousHighlight} class="jp">
    {textBeforeHighlight}<mark class="shdx-badge-cyan">{textHighlighted}</mark>{textAfterHighlight}
</span>

<script>
    import {
    	onMount,
        onDestroy,
        createEventDispatcher
    } from 'svelte';
    import {splitHighlightedTextByRange} from "./utils";
    export let text = '';
    export let highlightRange;

    $: computeHighlight(text, highlightRange);

    const dispatch = createEventDispatcher(),
        SELECTION_DEBOUNCE_TIMEOUT = 700;
    let textElement,
        selectionDebounce,
        textBeforeHighlight = '',
        textHighlighted = '',
        textAfterHighlight = '';

    function computeHighlight(text, highlightRange) {
        if (highlightRange) {
            const {after, highlight, before} = splitHighlightedTextByRange(text, highlightRange);
            textBeforeHighlight = before;
            textHighlighted = highlight;
            textAfterHighlight = after;
        }
        else {
            textBeforeHighlight = '';
            textHighlighted = ''
            textAfterHighlight = text;
        }
    }

    function cancelPreviousHighlight() {
        highlightRange = null;
    }

    function debounceSelection(e) {
		//debounce selections, this otherwise runs for every extra character selected
		clearTimeout(selectionDebounce);
		selectionDebounce = setTimeout(onSelection, SELECTION_DEBOUNCE_TIMEOUT);
    }

    function onSelection() {
    	//don't double select if mouseup happened but we were waiting to debounce
		clearTimeout(selectionDebounce);

		const sel = window.getSelection(),
			selectionText = sel.toString();

		//need to make sure textElement exists, when lots of clicking is done (lots of deleting phrases on the list,
        //or clicking 'next phrase' in the export app quickly) textElement can be nulled out
		if (textElement && [sel.anchorNode, sel.focusNode].every(node => textElement.contains(node)) && selectionText) {
		    const ranges = [sel.focusOffset, sel.anchorOffset]
			dispatch('text-select', {
			    text: selectionText.trim(),
                range: [Math.min(...ranges), Math.max(...ranges)]}
            );
		}
	}

	onMount(() => {
		document.addEventListener('selectionchange', debounceSelection);
	});
	onDestroy(() => {
		document.removeEventListener('selectionchange', debounceSelection);
	});
</script>