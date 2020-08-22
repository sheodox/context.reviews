<style>
	.trigger {
		display: none;
	}
	.buttons {
		display: flex;
		flex-direction: row;
	}
	.collapsing-buttons {
		position: relative;
	}
	@media (max-width: 950px) {
		.buttons:not(.active) {
			display: none;
		}
		.trigger {
			display: block;
		}
        .active {
			flex-direction: column;
			background: var(--panel-bg);
			position: absolute;
			/* without this the expand icon for other rows shows above the buttons */
			z-index: 10;
        }
	}
</style>

<div class="collapsing-buttons" style="--collapse-breakpoint: {collapseBreakpoint}">
	<button class="trigger small" on:click={() => active = !active}>
		<Icon icon="expand_more" noPadding={true}/>
		<span class="sr-only">More</span>
	</button>
	<div class="buttons" class:active={active}>
		<slot />
	</div>
</div>

<svelte:window on:resize={() => active = false} />

<script>
	import Icon from './Icon.svelte';
	export let collapseBreakpoint;
	let active = false;
</script>