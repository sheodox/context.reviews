<style lang="scss">
	#context-reviews-panel,
	#context-reviews-show {
		background: var(--contextreviews-background);
		border-radius: 10px;
		margin: 0.5rem;
		padding: 0.5rem;
		color: white;
	}
	#context-reviews-panel {
		max-width: 100%;
		width: 30rem;
	}
	#context-reviews-show {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		p {
			margin: 0;
			line-height: 1;
			text-align: left;
		}
		.phrase-count {
			font-size: 0.7rem;
		}
		&.has-errors {
			background-color: hsl(0, 80%, 10%);
			border: 1px solid hsl(0, 75%, 50%);
		}
	}
	.heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	a {
		text-decoration: none;
	}
	h1 {
		color: white;
		font-size: 1.9rem;
		margin: 0;
	}
	.flex-1 {
		flex: 1;
	}
	.error-msg {
		background-color: hsl(0, 80%, 10%);
		border: 1px solid hsl(0, 75%, 50%);
		color: hsl(0, 80%, 85%);
		border-radius: 5px;
		padding: 0 0.5rem;
		display: flex;
		align-items: center;

		p {
			margin: 0;
			flex: 1;
		}
		button {
			color: white !important;
		}
	}
</style>

{#if ready}
	{#if show}
		<div id="context-reviews-panel" on:mouseenter={pauseHide} on:mouseleave={resumeHide}>
			<div class="heading">
				<LogoImage />
				<a href="https://context.reviews" rel="noopener" class="flex-1"><h1>Context.Reviews</h1></a>
				<button on:click={hidePanel}>
					&times;
					<span class="sr-only">Hide</span>
				</button>
			</div>
			{#each $errorMessages as msg}
				<div class="error-msg">
					<p>
						{msg}
					</p>
					<button on:click={() => removeErrorMessage(msg)}> &times; </button>
				</div>
			{/each}

			{#each $phrases as phrase}
				<StasherPhrase {phrase} />
			{:else}
				{#if !hasErrors}
					<Loading />
				{/if}
			{/each}
		</div>
	{:else}
		<button id="context-reviews-show" on:click={() => (show = true)} class:has-errors={hasErrors}>
			<LogoImage />
			<div>
				<p class="app-title">Context.Reviews</p>
				<p class="phrase-count">
					{#if hasErrors}
						Error!
					{:else}
						{$phrases.length} phrase{$phrases.length === 1 ? '' : 's'}
					{/if}
				</p>
			</div>
		</button>
	{/if}
{/if}

<script lang="ts">
	import Loading from 'sheodox-ui/Loading.svelte';
	import LogoImage from './LogoImage.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { phrases, errorMessages, removeErrorMessage } from './stasher-stores';
	import { getSetting, promptRecord, record, settingNames } from '../extension-utils';
	import StasherPhrase from './StasherPhrase.svelte';

	const HIDE_TIMEOUT_MS = 5000;

	$: hasErrors = $errorMessages.length > 0;
	let ready = false,
		show = true,
		showTimeRemaining = Infinity,
		hideInterval: ReturnType<typeof setInterval>;

	function pauseHide() {
		showTimeRemaining = Infinity;
	}

	async function resumeHide() {
		showTimeRemaining = HIDE_TIMEOUT_MS;
		show = true;

		const autoHide = await getSetting(settingNames.autoHide);
		if (!autoHide) {
			return;
		}

		let lastTime = Date.now();
		hideInterval = setInterval(() => {
			const delta = Date.now() - lastTime;
			lastTime = Date.now();
			showTimeRemaining -= delta;
			if (showTimeRemaining < 0) {
				hidePanel();
			}
		}, 100);
	}

	function hidePanel() {
		show = false;
		clearInterval(hideInterval);
	}

	onMount(async () => {
		const recordingMode = await getSetting(settingNames.recordingMode),
			hideInitially = await getSetting(settingNames.initiallyHideToasts),
			toastPosition = await getSetting(settingNames.toastPosition);

		document.getElementById('context-reviews-root').classList.add(`docked-${toastPosition}`);

		show = !hideInitially;

		// if 'never' is selected, pretend like the extension is disabled
		if (recordingMode === 'never') {
			return;
		}

		ready = true;

		if (!hideInitially) {
			resumeHide();
		}

		switch (recordingMode) {
			case 'always':
				record();
				break;
			case 'prompt':
				promptRecord();
				break;
		}
	});

	onDestroy(() => {
		clearInterval(hideInterval);
	});
</script>
