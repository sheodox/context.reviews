{#if $activeRoute == 'list'}
	<ListApp />
{:else if $activeRoute == 'import'}
	<ImportApp />
{:else if $activeRoute == 'import/subtitles'}
	<ImportSubtitles />
{:else if $activeRoute == 'import/plain'}
	<ImportPlain />
{:else if $activeRoute == 'export'}
	<ExportApp />
{:else if $activeRoute == 'settings'}
	<SettingsPage />
{:else if $activeRoute == 'about'}
	<AboutPage />
{:else if $activeRoute == 'help'}
	<HelpPage />
{/if}

<script lang="ts">
	import ExportApp from './export-app/ExportApp.svelte';
	import ImportApp from './import-app/ImportApp.svelte';
	import ImportPlain from './import-app/ImportPlain.svelte';
	import ImportSubtitles from './import-app/ImportSubtitles.svelte';
	import ListApp from './list-app/ListApp.svelte';
	import AboutPage from './pages/About.svelte';
	import HelpPage from './pages/Help.svelte';
	import SettingsPage from './pages/Settings.svelte';
	import { activeRoute } from './stores/routes';
</script>
