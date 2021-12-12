{#if $activeRoute == 'list'}
	<ListApp />
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
	import ListApp from './list-app/ListApp.svelte';
	import AboutPage from './pages/About.svelte';
	import HelpPage from './pages/Help.svelte';
	import SettingsPage from './pages/Settings.svelte';
	import { activeRoute } from './stores/routes';
</script>
