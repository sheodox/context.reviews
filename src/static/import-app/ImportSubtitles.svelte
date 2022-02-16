<style>
	input[type='file'] {
		display: none;
	}
</style>

<Layout title="Import Subtitles">
	<div class="f-column f-1 align-items-center">
		{#if !phrases}
			<label for="srt-upload" class="button">
				<div class="f-row align-items-center">Select a Subtitle File</div>
			</label>
			<input type="file" id="srt-upload" on:change={loadSubtitleFile} accept=".srt,.ass,.ssa,.vtt" />
		{:else}
			<button on:click={discard}><Icon icon="times" />Discard</button>
		{/if}

		{#if phrases}
			<ImportPhraseList {phrases} bind:numSelected />
		{/if}
	</div>
</Layout>

<script lang="ts">
	import { Icon } from 'sheodox-ui';
	import { parseASS, parseSubrip } from './subtitle-parser';
	import ImportPhraseList from './ImportPhraseList.svelte';
	import Layout from '../pages/Layout.svelte';
	import { createAutoExpireToast } from 'sheodox-ui';

	let phrases: string[];
	let numSelected = 0;

	const parserByExtension = {
		ass: parseASS,
		ssa: parseASS,
		vtt: parseSubrip,
		srt: parseSubrip,
	};

	function loadSubtitleFile(e: Event) {
		const file = (e.target as HTMLInputElement).files[0],
			reader = new FileReader();

		reader.onload = (readEvent) => {
			const extension = file.name.match(/\.(\w{3})$/)[1],
				fileContents = readEvent.target.result.toString();

			try {
				phrases = parserByExtension[extension as keyof typeof parserByExtension](fileContents);
			} catch (e) {
				console.error(e);
				createAutoExpireToast({
					title: 'Subtitle Parse Error',
					message:
						'Context.Reviews encountered an error trying to parse those subtitles. Please report this issue so it can be fixed.',
					variant: 'error',
					href: 'https://github.com/sheodox/context.reviews/issues/new',
				});
			}
		};
		reader.readAsText(file);
	}

	function discard() {
		if (
			numSelected === 0 ||
			confirm("You have selected phrases but haven't added them yet, are you sure you want to cancel?")
		) {
			phrases = null;
		}
	}
</script>
