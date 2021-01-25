<style>
    #replay-toasts {
        background: var(--contextreviews-background);
    }
</style>

<div
    on:mouseenter={pauseExpiration}
    on:mouseleave={resumeExpiration}
>
    {#if $hasHiddenToasts}
        <button on:click={replayToasts} id="replay-toasts">
            <LogoImage />
            Replay
        </button>
    {/if}

    {#each $toasts as toast}
        <StasherToast toast={toast} />
    {/each}

    {#if showPrompt}
        <StashPrompt bind:showPrompt />
    {/if}
</div>

<script>
    import StasherToast from "./StasherToast.svelte";
    import LogoImage from "./LogoImage.svelte";
    import {onMount} from "svelte";
    import {
        toasts,
        hasHiddenToasts,
        pauseExpiration,
        resumeExpiration,
        replayToasts
    } from "./toast-stores";
    import {getSetting, record} from "../extension-utils";
    import StashPrompt from "./StashPrompt.svelte";

    let showPrompt = false;

    onMount(async () => {
        const recordingMode = await getSetting('recordingMode'),
            toastPosition = await getSetting('toastPosition');

        document.getElementById('context-reviews-root')
            .classList
            .add(`docked-${toastPosition}`);

        switch (recordingMode) {
            case 'always':
                record();
                break;
            case 'prompt':
                showPrompt = true;
                break;
            //do nothing for 'never'
        }
    })
</script>