<style>
    .phrase {
        display: flex;
        padding: 0.4rem;

    }
    .phrase:hover {
         background: var(--contextreviews-background-light)
     }

    span {
        color: white;
        flex: 1;
        margin-right: 0.2rem;
    }

    span.deleted {
         text-decoration: line-through;
         color: #888;
    }
</style>

<li class="phrase">
    <span class:deleted={deleted}>
        {phrase.phrase}
    </span>
    {#if !deleted}
        <button
            on:click={removePhrase}
        >
            Delete
        </button>
    {:else}
        <button
            on:click={addPhrase}
        >
            Add
        </button>
    {/if}
</li>

<script>
    import {addCouldntConnectToast, messageBackground} from "../extension-utils";
    //phrase is {phrase: string, phrase_id: string}
    export let phrase;

    let deleted = false;

    async function removePhrase() {
        const {status} = await messageBackground('removePhrase', phrase.phrase_id)
        if (status === 200) {
            deleted = true;
        }
        else if (status === 0) {
            addCouldntConnectToast()
        }
    }

    async function addPhrase() {
        const {status} = await messageBackground('addPhrase', phrase.phrase)
        if (status === 200) {
            deleted = false;
        }
        else if (status === 0) {
            addCouldntConnectToast()
        }
    }
</script>