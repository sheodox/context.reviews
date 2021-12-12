{#each nav as navItem}
	<li>
		<Link href={navItem.href} classes={navItem.route === $activeRoute ? 'active' : ''}>
			<Icon icon={navItem.icon} />
			{navItem.text}
		</Link>
	</li>
{/each}

<script lang="ts">
	import { Icon } from 'sheodox-ui';
	import { activeRoute } from './stores/routes';
	import Link from './Link.svelte';

	const nav = [
		{
			route: 'list',
			href: '/',
			icon: 'stream',
			text: 'Phrases',
		},
		{
			route: 'export',
			href: '/export',
			icon: 'clone',
			text: 'Anki Export',
		},
	];
</script>
