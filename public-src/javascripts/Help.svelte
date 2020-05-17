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
	dt {
		font-weight: bold;
	}
</style>

<h2>Usage</h2>
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

<h2>
	Some shortcuts of note!
</h2>

<dl>
	<dt>S (when not in the search field)</dt>
	<dd>Focus the search input.</dd>

	<dt>Ctrl+Z (when not in the search field)</dt>
	<dd>Undo the last phrase deletion.</dd>

	<dt>Ctrl+Enter</dt>
	<dd>Add the first Jisho search result to the review list.</dd>

	<dt>Hold Shift</dt>
	<dd>When in Review Mode, holding shift will momentarily change the hide button to a delete button.</dd>
</dl>
