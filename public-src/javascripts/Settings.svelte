<style>
	p {
		max-width: 20rem;
		margin: 0.4rem;
	}
</style>

<div class="panel-body f-column">
	<p>
		Your browser's built-in speech synthesis can be used to read words,
		as hearing can make it easier to remember.
		It's not always accurate so make sure to reference the word's reading.
	</p>

	<Checkbox id="settings-speech-synthesis" bind:checked={$settings.speechSynthesis}>
		Show speech synthesis buttons on definitions
	</Checkbox>

	<Checkbox id="settings-auto-speech-synthesis" bind:checked={$settings.autoSpeechSynthesis}>
		Automatically read selected words
	</Checkbox>
</div>

<script>
	import {Checkbox} from 'sheodox-ui';
	import {settings} from './metadataStore';
	import phraseStore from "./phraseStore";
</script>