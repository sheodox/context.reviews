<!-- This component is "AppHeader" because it's used on the 'app' pages, i.e. the pages where
the user is actually logged in and the user actually can meaningfully interact with the site -->

<Header appName="Context.Reviews" {pageName} slim={true}>
	<div slot="logo"><Image src="favicon" pictureClasses="f-row align-items-center" alt="logo" /></div>
	<nav slot="headerCenter">
		<ul>
			<Nav />
		</ul>
	</nav>
	<nav slot="headerEnd">
		<ul>
			<li>
				<UserMenu />
			</li>
		</ul>
	</nav>
</Header>

<script lang="ts">
	import Image from './Image.svelte';
	import { Header } from 'sheodox-ui';
	import UserMenu from './UserMenu.svelte';
	import Nav from './Nav.svelte';

	export let pageName = '';
</script>
