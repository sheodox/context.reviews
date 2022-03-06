<style>
	.buttons {
		display: flex;
		justify-content: flex-end;
	}
</style>

<div class="toast">
	<div class="title-bar">
		<LogoImage />
		Save this phrase?
		<button on:click={hide}>
			&Cross;
			<span class="sr-only">Close notification</span>
		</button>
	</div>
	<div class="buttons">
		<button on:click={clickedYes}>Yes</button>
		<button on:click={hide}>No</button>
	</div>
</div>

<script>
	import LogoImage from './LogoImage.svelte';
	import { record } from '../extension-utils';
	export let showPrompt;

	function clickedYes() {
		record();
		hide();
	}
	function hide() {
		showPrompt = false;
	}
</script>
