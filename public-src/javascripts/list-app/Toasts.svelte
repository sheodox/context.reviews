<style>
    .toast-container {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1rem;
        display: flex;
        flex-direction: column;
    }

    .toast {
        margin: 0.5rem;
        align-self: center;
        background: #3db4f2;
        color: black;
		padding: 0.2rem 1rem;
        text-align: center;
	}
    p {
        margin: 0.2rem;
    }
</style>

<div class="toast-container">
    {#each toasts as toast (toast.text + toast.subtext)}
        <div class="toast" transition:fly={{y: 200}} animate:flip >
            <p>{toast.text}</p>
            {#if toast.subtext}
                <small>{toast.subtext}</small>
            {/if}
        </div>
    {/each}
</div>

<script>
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';
    import phraseStore from '../phraseStore';
    const TOAST_VISIBLE_TIME = 4 * 1000;
    let toasts = [];

    let lastPhrases = null;
    phraseStore.subscribe(phrases => {
    	//haven't requested phrases yet, wait
    	if (phrases === null) {
    		return;
        }

    	//init, nothing to notify of here, don't want to notify them of the entire list
        if (!lastPhrases) {
        	lastPhrases = phrases;
        	return;
        }

		const newPhrases = phrases.filter(({phrase}) => {
            return !lastPhrases.some(lastPhrase => {
            	return lastPhrase.phrase === phrase;
            })
        })

        if (newPhrases.length) {
            newPhrases.forEach(phrase => {
                const toast = {
                    text: `Added phrase`,
                    subtext: phrase.phrase
                };
                toasts = [...toasts, toast];

                setTimeout(() => {
                    toasts.splice(toasts.indexOf(toast), 1)
                    toasts = toasts;
                }, TOAST_VISIBLE_TIME);
			});
        }

		lastPhrases = phrases;
    })
</script>