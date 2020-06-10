<style>
	div {
		display: flex;
        flex-direction: column;
	}
	label {
		white-space: nowrap;
		margin-right: 0.2rem;
	}
	progress {
		flex: 1;
	}
</style>

<div>
	<label for="processed-phrases">
		Phrases processed ({processedPhrases}/{totalPhrases})
	</label>
	<progress id="processed-phrases" value={processedPhrases} max={totalPhrases}></progress>
</div>


<script>
    export let processedPhrases = 0;
    export let totalPhrases = 1;
</script>