<style>
	.ttl-track {
		height: 0.3rem;
		background: #343944;
		border-bottom: 1px solid #343944;
		width: 100%;
	}

	.ttl-bar {
		background: var(--contextreviews-purple);
		height: 100%;
	}

	a {
		flex: 1;
		padding-left: 0.4rem;
		margin-left: 0.4rem;
	}

	.error .title-bar {
		background: #e83450;
		color: black;
	}

	ul {
		margin: 0.3rem;
		list-style: none;
	}
</style>

<!-- using .hidden instead of {#if} so StasherToastPhrase can maintain local state for if it's deleted -->
<div class="toast {toast.type}" class:hidden={toast.hidden}>
	{#if toastAnimations}
		<div class="ttl-track">
			<div class="ttl-bar" style={ttlStyle} />
		</div>
	{/if}
	<div class="title-bar">
		<LogoImage />
		<a href="--server--" target="_blank" rel="noreferrer noopener">{toast.text}</a>
		<button on:click={() => hideToast(toast.id)}>
			&Cross;
			<span class="sr-only">Close notification</span>
		</button>
	</div>
	{#if toast.phrases}
		<ul>
			{#each toast.phrases as phrase (phrase.phrase_id)}
				<StasherToastPhrase {phrase} />
			{/each}
		</ul>
	{/if}
</div>

<script>
	import LogoImage from './LogoImage.svelte';
	import StasherToastPhrase from './StasherToastPhrase.svelte';
	import { hideToast } from './toast-stores';

	export let toast;
	export let toastAnimations;

	$: ttlStyle = `width: ${100 * (toast.ttl / toast.duration)}%`;
</script>
