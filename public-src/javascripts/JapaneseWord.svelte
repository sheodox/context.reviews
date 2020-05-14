<ruby>
    {word}
    {#if word !== reading && reading}
		<rp>(</rp>
		<rt>{reading}</rt>
		<rp>)</rp>
    {/if}
</ruby>
<script>
    export let word;
    export let reading;
</script>