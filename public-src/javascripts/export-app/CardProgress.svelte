<style>
	div {
		display: flex;
	}
	label {
		white-space: nowrap;
		margin-right: 0.2rem;
	}
</style>

<div>
	<label for="processed-phrases">
		Phrases processed:
	</label>
	<progress id="processed-phrases" value={processedPhrases} max={totalPhrases} title="{processedPhrases} / {totalPhrases}"></progress>
</div>


<script>
    export let processedPhrases = 0;
    export let totalPhrases = 1;
</script>