<style>
	.page-layout {
		padding: var(--shdx-spacing-5);
		margin: 0 auto;
		width: 40rem;
		max-width: 100%;
	}
	h1 {
		margin-bottom: var(--shdx-spacing-1);
		margin-top: var(--shdx-spacing-3);
		font-size: var(--shdx-font-size-10);
	}
	@media (max-width: 600px) {
		.page-layout {
			padding: var(--shdx-spacing-3);
		}
		h1 {
			font-size: var(--shdx-font-size-8);
		}
	}
</style>

<div class="page-layout">
	<div class="text-align-right">
		{#if showBackLink}
			<Link href="/" classes="inline-link">
				<Icon icon="chevron-left" />
				Back to phrase list
			</Link>
		{/if}
	</div>
	<h1>{title}</h1>
	<slot />
</div>

<script lang="ts">
	import { Icon } from 'sheodox-ui';
	import Link from '../Link.svelte';

	export let title: string;
	export let showBackLink = true;
</script>
