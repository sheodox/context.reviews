<!-- use mouseup to short circuit the selectionchange debounce -->
<span bind:this={textElement} on:mouseup={onSelection} class="jp">
    {text}
</span>

<script>
    import {
    	onMount,
        onDestroy,
        createEventDispatcher
    } from 'svelte';
    export let text = '';

    let textElement;
    const dispatch = createEventDispatcher();

	let selectionDebounce;
	const SELECTION_DEBOUNCE_TIMEOUT = 500;
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
		if (textElement && sel.containsNode(textElement, true) && selectionText) {
			dispatch('text-select', selectionText.trim());
		}
	}

	onMount(() => {
		document.addEventListener('selectionchange', debounceSelection);
	});
	onDestroy(() => {
		document.removeEventListener('selectionchange', debounceSelection);
	});
</script>