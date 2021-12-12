<Layout title="Settings">
	<TabList bind:selectedTab {tabs} />

	<Tab {selectedTab} tabId="settings">
		<div class="panel-body f-column">
			<p>
				Your browser's built-in speech synthesis can be used to read words, as hearing can make it easier to remember.
				It's not always accurate so make sure to reference the word's reading.
			</p>

			<Checkbox id="settings-speech-synthesis" bind:checked={$settings.speechSynthesis}>
				Show speech synthesis buttons on definitions
			</Checkbox>

			<Checkbox id="settings-auto-speech-synthesis" bind:checked={$settings.autoSpeechSynthesis}>
				Automatically read selected words
			</Checkbox>
		</div>
	</Tab>

	<Tab {selectedTab} tabId="stats">
		<Stats />
	</Tab>
</Layout>

<script lang="ts">
	import Layout from './Layout.svelte';
	import { Checkbox, TabList, Tab } from 'sheodox-ui';
	import { settings } from '../stores/metadata';
	import Stats from '../Stats.svelte';

	let selectedTab: string;
	const tabs = [
		{
			id: 'settings',
			title: 'Settings',
		},
		{
			id: 'stats',
			title: 'Stats',
		},
	];
</script>
