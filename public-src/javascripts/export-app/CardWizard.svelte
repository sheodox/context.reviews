<style>
</style>

<div>
	<label for="processed-phrases">
		Phrases processed
	</label>
    <br>
	<progress id="processed-phrases" value={processedPhrases} max={totalPhrases} title="{processedPhrases} / {totalPhrases}"></progress>
</div>


<script>
	import CardBuilder from "./CardBuilder.svelte";
    export let processedPhrases = 0;
    export let totalPhrases = 1;
</script>