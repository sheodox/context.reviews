<style>
	ul {
		padding: 0;
	}
</style>

<Footer>
	<nav class="simple-footer-links">
		<ul>
			<li>
				{#if signedIn}
					<a href="/auth/logout">
						<Icon icon="sign-out-alt" />
						Sign Out
					</a>
				{:else}
					<a href="/auth/google">
						<Icon icon="sign-in-alt" />
						Log In
					</a>
				{/if}
			</li>
			<li>
				<a href="mailto:help@context.reviews">
					<Icon icon="envelope" /> Help & Feedback
				</a>
			</li>
			<li>
				<a href="/privacy">
					<Icon icon="user-shield" /> Privacy Policy
				</a>
			</li>
			<li>
				<ExternalLink href="https://sheodox.com/">&copy;2021 sheodox</ExternalLink>
			</li>
		</ul>
	</nav>
</Footer>

<script lang="ts">
	import { Icon, Footer } from 'sheodox-ui';
	import ExternalLink from './ExternalLink.svelte';

	export let signedIn = true;
</script>
