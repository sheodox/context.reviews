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
    footer a + a {
        margin-left: 1rem;
    }
</style>

<footer>
    <a href="/auth/logout">
        <Icon icon="login" />
        Sign Out
    </a>
    <a href="mailto:help@context.reviews">
        <Icon icon="email" />
        Help & Feedback
    </a>
</footer>

<script>
    import Icon from './Icon.svelte';
</script>