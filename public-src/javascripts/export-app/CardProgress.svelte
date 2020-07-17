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
	progress {
		width: 100%;
	}
	progress::-moz-progress-bar {
		background-size: var(--progress-bg-size) 100%;
	}
	progress::-webkit-progress-value {
		background-size: var(--progress-bg-size) 100%;
	}
</style>

<div>
	<label for="processed-phrases">
		Phrases processed ({processedPhrases}/{totalPhrases})
	</label>
    <div class="progress-border">
		<progress
			id="processed-phrases"
			value={processedPhrases}
			max={totalPhrases}
            style="--progress-bg-size: {bgSize}%"
		></progress>
	</div>
</div>


<script>
    export let processedPhrases = 0;
    export let totalPhrases = 1;
    $: bgSize = (totalPhrases / processedPhrases) * 100;
</script>