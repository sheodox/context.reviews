<style>
    .page {
        padding: 1rem;
    }
    h1 {
        font-size: 1rem;
        white-space: nowrap;
    }
    header {
        display: flex;
        align-items: center;
    }
    fieldset {
        border: none;
    }
</style>

<div class="page">
    <header>
        <LogoImage />
        <h1>
            Context.Reviews Extension Settings
        </h1>

    </header>

    <main>
        <fieldset on:change={saveRecordingMode}>
            <legend>Search Save Mode</legend>
            <label>
                <input type="radio" bind:group={recordingMode} value="always">
                Always save searches
            </label>
            <br>
            <label>
                <input type="radio" bind:group={recordingMode} value="prompt">
                Prompt every time
            </label>
            <br>
            <label>
                <input type="radio" bind:group={recordingMode} value="never">
                Never save searches
            </label>
        </fieldset>

        <fieldset on:change={saveToastPosition}>
            <legend>Notification Position</legend>

            <label>
                <input type="radio" bind:group={toastPosition} value="left">
                Left side
            </label>
            <br>
            <label>
                <input type="radio" bind:group={toastPosition} value="right">
                Right side
            </label>
        </fieldset>
    </main>
</div>
<script>
    import LogoImage from "../stasher/LogoImage.svelte";
    import {getSetting, setSetting} from "../extension-utils";
    import {onMount} from "svelte";

    let recordingMode, toastPosition;

    function saveRecordingMode() {
        setSetting('recordingMode', recordingMode);
    }

    function saveToastPosition() {
        setSetting('toastPosition', toastPosition);
    }

    onMount(async () => {
        recordingMode = await getSetting('recordingMode');
        toastPosition = await getSetting('toastPosition');
    })
</script>
