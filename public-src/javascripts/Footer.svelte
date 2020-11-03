<style>
    footer {
        width: 100%;
        position: relative;
        bottom: 0;
        padding: 1rem;
        background: var(--panel-footer-bg);
        border-top: 1px solid var(--accent-purple);
        display: flex;
        justify-content: center;
    }
    footer * + * {
        margin-left: 1rem;
    }
	@media (max-width: 650px) {
		footer {
			flex-direction: column;
			align-items: center;
		}
		footer > * {
			margin: 0;
		}
	}
</style>

<footer>
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

	<a href="mailto:help@context.reviews">
        <Icon icon="email" /> Help & Feedback
    </a>

	<a href="/privacy">
        <Icon icon="privacy_tip" /> Privacy Policy
    </a>

    <span>
        <ExternalLink href="https://github.com/sheodox">&copy;2020 sheodox</ExternalLink>
    </span>
</footer>

<script>
	import {Icon} from 'sheodox-ui';
	import ExternalLink from "./ExternalLink.svelte";

	export let signedIn = true;
</script>