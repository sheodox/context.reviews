<style>
    a:not(:hover) {
        text-decoration: none;
    }
</style>
<a href={href} target="_blank" rel="noreferrer noopener"><slot/></a>
<script>
    export let href;
</script>