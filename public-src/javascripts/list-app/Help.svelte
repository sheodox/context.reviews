<script>
	import ExternalLink from "../ExternalLink.svelte";
	const jishoSearchBookmarklet = `javascript:(function() {
			const selection = window.getSelection().toString();
			if (selection) {
				window.open('https://jisho.org/search/' + encodeURIComponent(selection))
			}
		}())
		`
</script>
<style>
	ol li {
		line-height: 2rem;
	}
	dt {
		font-weight: bold;
	}
	a:not(:hover) {
		text-decoration: none;
	}
    p {
		margin: 0;
	}
	p.hint {
		margin-left: 2rem;
	}
</style>

<h2>Setup</h2>
<ol>
    <li>
		<ExternalLink href="https://www.tampermonkey.net/">Install the Tampermonkey browser extension.</ExternalLink>
	</li>
	<li>
		<!-- not using ExternalLink because it'd leave you with a blank tab as Tampermonkey takes over -->
		<a href="javascripts/jisho-phrase-stasher.user.js">Click here then click the "install" button on the Tampermonkey page that shows up.</a>
		This will automatically make a note of all of the searches you make for Japanese words and phrases.
	</li>
	<li>
		Look up sentences containing unknown words as you read some Japanese.
        <br>
		<p class="hint">
			<strong>Hint!</strong> Drag this link to your bookmark bar: <a href={jishoSearchBookmarklet}>Jisho Search</a>
			When you are reading a web page you can select some Japanese text then click that bookmark to quickly open a Jisho search!
		</p>
	</li>
	<li>
		Return here to review and export to an Anki deck!
		<p class="hint">
            <strong>Hint!</strong>
			If you had searched for full sentences you'll see it included as
			a context sentence on the back of the Anki cards.
		</p>
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

	<dt>Hover words in the definition search</dt>
	<dd>Hover over a word with furigana for a bit and the word and furigana will get bigger so it's easier to read.</dd>

	<dt>Esc + Esc</dt>
	<dd>Clear the search field</dd>
</dl>
