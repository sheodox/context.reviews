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
		background: var(--sx-panel-header-bg);
		border-bottom: var(--sx-panel-border);
		padding: 0.5rem;
	}
	fieldset {
		border-color: hsl(227, 21%, 43%);
		border-radius: 5px;
		margin: 0.5rem 0 0 0;
		padding: 0.5rem;
	}
	main {
		display: flex;
		flex-direction: column;
		max-width: 300px;
		padding: 1rem;
	}
	.single-option {
		padding-bottom: 0.5rem;
	}
</style>

<header>
	<LogoImage />
	<h1>
		<a rel="noreferrer" target="_blank" href="https://context.reviews">Context.Reviews</a>
	</h1>
</header>

<main>
	<h2>Extension Settings</h2>

	<label class="single-option">
		<input type="checkbox" bind:checked={autoHide} on:change={() => setSetting(settingNames.autoHide, autoHide)} />
		Auto-hide the Context.Reviews popup after a few seconds
	</label>

	<label class="single-option">
		<input
			type="checkbox"
			bind:checked={initiallyHideToasts}
			on:change={() => setSetting(settingNames.initiallyHideToasts, initiallyHideToasts)}
		/>
		Start with the Context.Reviews popup hidden
	</label>

	<label class="single-option">
		<input type="checkbox" bind:checked={showActivePhrasesBadge} on:change={badgeSettingsChange} />
		Show your current number of saved phrases on the icon in the browser toolbar
	</label>

	<fieldset on:change={() => setSetting(settingNames.recordingMode, recordingMode)}>
		<legend>Search Save Mode</legend>
		<label>
			<input type="radio" bind:group={recordingMode} value="always" />
			Always save searches
		</label>
		<br />
		<label>
			<input type="radio" bind:group={recordingMode} value="prompt" />
			Prompt every time
		</label>
		<br />
		<label>
			<input type="radio" bind:group={recordingMode} value="never" />
			Never save searches
		</label>
	</fieldset>

	<fieldset on:change={() => setSetting(settingNames.toastPosition, toastPosition)}>
		<legend>Notification Position</legend>

		<label>
			<input type="radio" bind:group={toastPosition} value="left" />
			Left side
		</label>
		<br />
		<label>
			<input type="radio" bind:group={toastPosition} value="bottom-center" />
			Bottom center
		</label>
		<br />
		<label>
			<input type="radio" bind:group={toastPosition} value="right" />
			Right side
		</label>
	</fieldset>
</main>

<script lang="ts">
	import LogoImage from '../stasher/LogoImage.svelte';
	import { getSetting, messageBackground, setSetting, settingNames } from '../extension-utils';
	import { onMount } from 'svelte';

	let recordingMode: 'always' | 'prompt' | 'never',
		toastPosition: 'left' | 'bottom-center' | 'right',
		initiallyHideToasts: boolean,
		autoHide: boolean,
		showActivePhrasesBadge: boolean;

	function badgeSettingsChange() {
		setSetting(settingNames.showActivePhrasesBadge, showActivePhrasesBadge);
		//notify the background script so it can fetch the phrase count and schedule polling.
		messageBackground('changeActivePhrasesBadge');
	}

	onMount(async () => {
		recordingMode = await getSetting(settingNames.recordingMode);
		toastPosition = await getSetting(settingNames.toastPosition);
		initiallyHideToasts = await getSetting(settingNames.initiallyHideToasts);
		showActivePhrasesBadge = await getSetting(settingNames.showActivePhrasesBadge);
		autoHide = await getSetting(settingNames.autoHide);
	});
</script>
