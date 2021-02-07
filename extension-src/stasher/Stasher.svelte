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
        <StasherToast toast={toast} {toastAnimations} />
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
    import {getSetting, record, settingNames} from "../extension-utils";
    import StashPrompt from "./StashPrompt.svelte";

    let showPrompt = false,
        toastAnimations;

    onMount(async () => {
        const recordingMode = await getSetting(settingNames.recordingMode),
            toastPosition = await getSetting(settingNames.toastPosition);
        toastAnimations = await getSetting(settingNames.toastAnimations);

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