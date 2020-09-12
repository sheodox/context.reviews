<style>
	header {
		width: 100%;
        justify-content: space-around;
	}
	header.slim {
        background: var(--panel-header-bg);
        justify-content: space-between;
        border-bottom: var(--panel-border);
	}
	header :global(img) {
		height: 4rem;
		width: 4rem;
		margin: 0 1rem;
	}
	header.slim :global(img) {
		height: 3rem;
		width: 3rem;
	}
	header.slim h1 {
		margin: 0.3rem 0;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.toolbar {
		margin: 0 1rem;
	}
	@media (max-width: 960px) {
		header {
			flex-direction: column !important;
		}
	}
	header :global(nav a) {
		font-size: 1rem;
	}
</style>

<header class="row" class:slim={slim}>
	<div class="branding row">
		<Image src="favicon" alt="logo" />
		<h1>{pageName ? `${pageName} -` : ''} Context.Reviews</h1>
	</div>
	<div class="toolbar">
		<slot />
	</div>
</header>

<script>
	import {asset} from './assets';
	import Image from "./Image.svelte";

	export let pageName;
	//slim=true is smaller and fits as part of the list/export apps
	//slim=false is bigger with no background, used prominently on the landing page
	export let slim = true;
</script>