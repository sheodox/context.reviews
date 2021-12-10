<!-- This component is "AppHeader" because it's used on the 'app' pages, i.e. the pages where
the user is actually logged in and the user actually can meaningfully interact with the site -->

<Header appName="Context.Reviews" {pageName} {slim}>
	<div slot="logo"><Image src="favicon" pictureClasses="f-row align-items-center" alt="logo" /></div>
	<nav slot="nav">
		<ul>
			<li>
				<slot />
			</li>
			<li>
				<UserMenu bind:showHelp bind:showSettings bind:showStats />
			</li>
		</ul>
	</nav>
</Header>

{#if showSettings}
	<Modal title="Settings" bind:visible={showSettings}>
		<Settings />
	</Modal>
{/if}

{#if showHelp}
	<Modal title="Help" bind:visible={showHelp}>
		<Help />
	</Modal>
{/if}

{#if showStats}
	<Modal title="Stats" bind:visible={showStats}>
		<Stats />
	</Modal>
{/if}

<script lang="ts">
	import Image from './Image.svelte';
	import { Header, Modal } from 'sheodox-ui';
	import UserMenu from './UserMenu.svelte';
	import Settings from './Settings.svelte';
	import Help from './Help.svelte';
	import Stats from './Stats.svelte';

	let showSettings = false,
		showHelp = false,
		showStats = false;

	export let pageName = '';
	//slim=true is smaller and fits as part of the list/export apps
	//slim=false is bigger with no background, used prominently on the landing page
	export let slim = true;
</script>
