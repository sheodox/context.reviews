<style>
	header {
		background: var(--panel-header-bg);
		width: 100%;
        justify-content: space-between;
	}

	h1 {
		border-left: 0.2rem solid var(--accent-purple);
		padding-left: 1rem;
	}

	img.logo {
		height: 4rem;
		width: 4rem;
		margin: 0 1rem;
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
</style>

<header class="row">
	<div class="branding row">
		<img src="/favicon.png" alt="logo" class="logo">
		<h1>{pageName ? `${pageName} -` : ''} Context.Review</h1>
	</div>
	<div class="toolbar">
		<slot />
	</div>
</header>

<script>
	export let pageName;
</script>