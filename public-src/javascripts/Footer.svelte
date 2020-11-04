<style>
	li {
		margin: 0 1rem;
	}
	ul {
		display: flex;
		flex-direction: row;
		margin: 0;
		justify-content: center;
	}
	@media (max-width: 650px) {
		ul {
			flex-direction: column;
			align-items: center;
		}
		li {
			margin: 1rem 0;
		}
	}
</style>

<Footer>
	<nav>
		<ul>
			<li>
				{#if signedIn}
					<a href="/auth/logout">
						<Icon icon="login" />
						Sign Out
					</a>
				{:else}
					<a href="/auth/google">
						<Icon icon="login" />
						Log In
					</a>
				{/if}
			</li>
			<li>
				<a href="mailto:help@context.reviews">
					<Icon icon="email" /> Help & Feedback
				</a>
			</li>
			<li>
				<a href="/privacy">
					<Icon icon="privacy_tip" /> Privacy Policy
				</a>
			</li>
			<li>
				<ExternalLink href="https://github.com/sheodox">&copy;2020 sheodox</ExternalLink>
			</li>
		</ul>
	</nav>
</Footer>

<script>
	import {Icon, Footer} from 'sheodox-ui';
	import ExternalLink from "./ExternalLink.svelte";

	export let signedIn = true;
</script>