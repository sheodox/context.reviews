<style>
	img {
		max-width: 1.5rem;
		max-height: 1.5rem;
		margin-right: 0.5rem;
	}
</style>

<NavDropdown>
	<img slot="button" src={user.profileImage} alt="{user.displayName} profile" />
	<span slot="button">{user.displayName}</span>

	<ul slot="menu">
		<li>
			<button class="a" on:click={() => showSettings = true}>
				<Icon icon="cog" /> Settings
			</button>
		</li>
		<li>
			<button class="a" on:click={() => showHelp = true}>
				<Icon icon="info-circle"/> Help
			</button>
		</li>
		<li>
			<button class="a" on:click={() => showStats = true}>
				<Icon icon="id-card" /> Stats
			</button>
		</li>
		<li>
			<a href="/auth/logout"><Icon icon="sign-in-alt" /> Logout</a>
		</li>
	</ul>
</NavDropdown>

<script>
	import {Icon, NavDropdown} from 'sheodox-ui';

	const user = window.userMetadata.user;
	//modals are handled by AppHeader so they can be mounted as a descendent of the app root instead of being
	//nested within the header/nav which would cause modals to inherit styles we don't want them to
	export let showSettings;
	export let showHelp;
	export let showStats;
</script>