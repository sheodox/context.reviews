<style>
	img {
		max-width: 1.5rem;
		max-height: 1.5rem;
		border-radius: 50%;
	}
</style>

<NavDropdown showOpenIcon={false}>
	<img slot="button" src={$user.profileImage} alt="{$user.displayName} profile" />

	<ul slot="menu">
		<li>
			<Link classes="button" href="/settings">
				<Icon icon="cog" /> Settings
			</Link>
		</li>
		<li>
			<Link classes="button" href="/about">
				<Icon icon="address-card" /> About
			</Link>
		</li>
		<li>
			<Link classes="button" href="/help">
				<Icon icon="info-circle" /> Help
			</Link>
		</li>
		<li>
			<a href="/auth/logout" class="button"><Icon icon="sign-in-alt" /> Logout</a>
		</li>
	</ul>
</NavDropdown>

<script lang="ts">
	import { Icon, NavDropdown } from 'sheodox-ui';
	import { user } from './stores/metadata';
	import Link from './Link.svelte';
</script>
