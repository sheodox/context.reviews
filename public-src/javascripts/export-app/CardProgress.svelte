<style>
	div {
		display: flex;
        flex-direction: column;
	}
	label {
		white-space: nowrap;
		margin-right: 0.2rem;
	}
	.progress-border {
		background: var(--accent-gradient);
		background-attachment: local;
		padding: 0.15rem;
		border-radius: 0.2rem;
		flex: 1;
	}
</style>

<div>
	<label for="processed-phrases">
		Phrases processed ({processedPhrases}/{totalPhrases})
	</label>
    <div class="progress-border">
		<progress id="processed-phrases" value={processedPhrases} max={totalPhrases}></progress>
	</div>
</div>


<script>
    export let processedPhrases = 0;
    export let totalPhrases = 1;
</script>