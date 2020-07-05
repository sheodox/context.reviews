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
        <Icon icon="email" />
        Help & Feedback
    </a>

    <span>
        &copy; 2020 sheodox
    </span>
</footer>

<script>
    import Icon from './Icon.svelte';
    export let signedIn = true;
</script>