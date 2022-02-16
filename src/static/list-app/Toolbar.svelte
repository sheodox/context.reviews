<style>
	#toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>

<div id="toolbar">
	<div>
		<button on:click={() => page('/import')}><Icon icon="plus" /> Import Phrases</button>
		<button on:click={undo}><Icon icon="undo" /> Undo Delete</button>
		{#if $settings.autoSpeechSynthesis || $settings.speechSynthesis}
			<button on:click={stop} disabled={!speaking}><Icon icon="stop" /> Stop Voice</button>
		{/if}
	</div>
	<div>
		<MenuButton>
			<span slot="trigger">
				<Icon icon="ellipsis-v" variant="icon-only" />
				<span class="sr-only">Menu</span>
			</span>

			<ul slot="menu">
				{#each extraMenuOptions as option}
					<li>
						<button on:click={option.handler}>{option.text}</button>
					</li>
				{/each}
			</ul>
		</MenuButton>
	</div>
</div>

<svelte:window on:keydown={keydown} />

<script lang="ts">
	import { Icon, MenuButton, createAutoExpireToast } from 'sheodox-ui';
	import { settings } from '../stores/metadata';
	import phraseStore from '../stores/phrases';
	import { copyToClipboard } from '../utils';
	import page from 'page';

	let speaking = false;

	const extraMenuOptions = [
		{
			handler: copyPhrases,
			text: 'Copy Phrases',
		},
		{
			handler: deleteAllPhrases,
			text: 'Delete All Phrases',
		},
	];

	function undo() {
		phraseStore.action('undo');
	}

	function stop() {
		speechSynthesis.cancel();
	}

	function phraseCount(num: number) {
		return `${num} phrase${num === 1 ? '' : 's'}`;
	}

	async function deleteAllPhrases() {
		if (!confirm(`Are you sure you want to delete all ${phraseCount($phraseStore.length)}?`)) {
			return;
		}

		await phraseStore.remove($phraseStore.map(({ id }) => id));
	}

	function keydown(e: KeyboardEvent) {
		if (e.key === 'z' && e.ctrlKey && (e.target as HTMLElement).tagName !== 'INPUT') {
			undo();
		}
	}

	function copyPhrases() {
		copyToClipboard($phraseStore.map(({ phrase }) => phrase).join('\n'));
		createAutoExpireToast({
			title: 'Copied',
			message: `${phraseCount($phraseStore.length)} have been copied.`,
		});
	}

	function eachFrame() {
		speaking = window.speechSynthesis.speaking;
		requestAnimationFrame(eachFrame);
	}

	eachFrame();
</script>
