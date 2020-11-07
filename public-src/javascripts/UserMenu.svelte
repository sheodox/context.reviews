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
			<a href="/auth/logout"><Icon icon="sign-in-alt" /> Logout</a>
		</li>
	</ul>
</NavDropdown>

{#if showSettings}
	<Modal title="Settings" bind:visible={showSettings}>
		<Settings />
	</Modal>
{/if}

<script>
	import {Icon, Modal, NavDropdown} from 'sheodox-ui';
	import Settings from "./Settings.svelte";

	const user = window.userMetadata.user;
	let showSettings = false;
</script>