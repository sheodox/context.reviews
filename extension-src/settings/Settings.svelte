<style>
    h1 {
        font-size: 1.5rem;
        white-space: nowrap;
        margin: 0;
        padding-left: 0.25rem;
    }
    h1 a {
        color: white;
    }
    h2 {
        font-size: 1.2rem;
        margin: 0;
    }
    header {
        display: flex;
        align-items: center;
        background: var(--shdx-panel-header-bg);
        border-bottom: var(--shdx-panel-border);
        padding: 0.5rem;
    }
    fieldset {
        border: none;
        margin: 0.5rem 0 0 0;
        padding: 0;
    }
    main {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        padding: 1rem;
    }
</style>

<header>
    <LogoImage />
    <h1>
        <a target="_blank" href="https://context.reviews">Context.Reviews</a>
    </h1>
</header>

<main>
    <h2>Extension Settings</h2>
    <label>
        <input
            type="checkbox"
            bind:checked={initiallyHideToasts}
            on:change={() => setSetting(settingNames.initiallyHideToasts, initiallyHideToasts)}
        />
        Hide notifications initially
    </label>

    <label>
        <input
            type="checkbox"
            bind:checked={toastAnimations}
            on:change={() => setSetting(settingNames.toastAnimations, toastAnimations)}
        />
        Use animations on notifications
    </label>

    <label>
        <input
            type="checkbox"
            bind:checked={showActivePhrasesBadge}
            on:change={badgeSettingsChange}
        />
        Show your current number of saved phrases on the icon
    </label>

    <fieldset on:change={() => setSetting(settingNames.recordingMode, recordingMode)}>
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

    <fieldset on:change={() => setSetting(settingNames.toastPosition, toastPosition)}>
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
<script>
    import LogoImage from "../stasher/LogoImage.svelte";
    import {getSetting, messageBackground, setSetting, settingNames} from "../extension-utils";
    import {onMount} from "svelte";

    let recordingMode, toastPosition, initiallyHideToasts, toastAnimations, showActivePhrasesBadge;

    function badgeSettingsChange() {
        setSetting(settingNames.showActivePhrasesBadge, showActivePhrasesBadge);
        //notify the background script so it can fetch the phrase count and schedule polling.
        messageBackground('changeActivePhrasesBadge');
    }

    onMount(async () => {
        recordingMode = await getSetting(settingNames.recordingMode);
        toastPosition = await getSetting(settingNames.toastPosition);
        initiallyHideToasts = await getSetting(settingNames.initiallyHideToasts);
        toastAnimations = await getSetting(settingNames.toastAnimations);
        showActivePhrasesBadge = await getSetting(settingNames.showActivePhrasesBadge);
    })
</script>
