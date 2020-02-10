<script>
	const url = location.href;

	function copyUrl() {
		document.querySelector('#userscript-url').select();
		document.execCommand('copy');
	}
</script>
<style>
	ol li {
		line-height: 2rem;
	}
</style>
<ol>
	<li>
		<a href="javascripts/jisho-phrase-stasher.user.js">Install this userscript</a>
	</li>
	<li>
		Go to <a href="https://jisho.org">Jisho.org</a>
	</li>
	<li>
		<label for="userscript-url">
			Paste in this url:
		</label>
		<input id="userscript-url" type="text" value={url}>
		<button on:click={copyUrl}>Copy</button>
	</li>
	<li>
		Look up sentences containing unknown words as you read
	</li>
	<li>
		Return here to review!
	</li>
</ol>
