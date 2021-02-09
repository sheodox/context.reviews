<style>
	p {
		max-width: 20rem;
		margin: 0.4rem;
	}
	hr {
		width: 100%;
	}
</style>

<div class="panel-body f-column">
	<p>
		Your browser's built-in speech synthesis can be used to read words,
		as hearing can make it easier to remember.
		It's not always accurate so make sure to reference the word's reading.
	</p>

	<label>
		<input type="checkbox" bind:checked={$settings.speechSynthesis}>
		Show speech synthesis buttons on definitions
	</label>

	<label>
		<input type="checkbox" bind:checked={$settings.autoSpeechSynthesis}>
		Automatically read selected words
	</label>
</div>

<script>
	import {settings} from './metadataStore';
	import phraseStore from "./phraseStore";
</script>