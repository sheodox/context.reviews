<style>
    .toast-container {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        border-radius: 3px;
    }

    .toast {
        margin: 0.5rem;
        align-self: center;
        background: var(--panel-bg);
        border: 1px solid var(--accent-purple);
		padding: 0.2rem 1rem;
        text-align: center;
	}
    p {
        margin: 0.2rem;
    }
    .text {
        font-weight: bold;
    }
</style>

<div class="toast-container">
    {#each toasts as toast (toast.text + toast.subtext)}
        <div class="toast">
            <p class="text">{toast.text}</p>
            {#if toast.subtext}
                <small class="jp">{toast.subtext}</small>
            {/if}
        </div>
    {/each}
</div>

<script>
    import phraseStore from '../phraseStore';
    const TOAST_VISIBLE_TIME = 4 * 1000;
    let toasts = [];

    function addToast(toast) {
		toasts = [...toasts, toast];

		setTimeout(() => {
			toasts.splice(toasts.indexOf(toast), 1)
			toasts = toasts;
		}, TOAST_VISIBLE_TIME);
	}

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

        if (newPhrases.length > 3) {
            addToast({
                text: 'Added Phrases',
                subtext: `${newPhrases.length} phrases were added.`
            })
        }
        else if (newPhrases.length) {
            newPhrases.forEach(phrase => {
                addToast({
                    text: `Added Phrase`,
                    subtext: phrase.phrase
                });
			});
        }

		lastPhrases = phrases;
    })
</script>