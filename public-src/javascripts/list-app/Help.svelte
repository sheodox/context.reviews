<style>
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
    .panel {
		max-width: 50rem;
		padding: 1rem;
		margin: 1rem;
	}
	h2 {
		margin: 0;
	}
	* + h2 {
		margin-top: 1rem;
	}
	ol {
		margin: 0;
	}
</style>

<div class="panel">
	<h2>Setup</h2>
	<p>
		Install the browser extension which will automatically keep track of all of the <ExternalLink href="https://jisho.org">Jisho.org</ExternalLink> searches you make for Japanese words and phrases.
		<ExternalLink href="https://addons.mozilla.org/en-US/firefox/addon/context-reviews/">Install for Firefox</ExternalLink>
		-
		<ExternalLink href="https://chrome.google.com/webstore/detail/contextreviews/epfpaalbjmjbplcegbkjiekehecfjjjp">Install for Chrome</ExternalLink>
	</p>
    <h2>Usage</h2>
	<ol>
		<li>
			Look up sentences containing unknown words as you read some Japanese.
			<br>
			<p class="hint">
				<Icon icon="info" />
				<strong>Hint!</strong> Drag this link to your bookmark bar: <a href={jishoSearchBookmarklet}>Jisho Search</a>.
				When you are reading a web page you can select some Japanese text then click that bookmark to quickly open a Jisho search!
			</p>
		</li>
		<li>
			Return here to review and export to an Anki deck using the "Anki Export" link at the top of the page.
			<p class="hint">
				<Icon icon="info" />
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
		<dd>Add the first Jisho search result to the phrase list.</dd>

		<dt>Hover words in the definition search</dt>
		<dd>Hover over a word with furigana for a bit and the word and furigana will get bigger so it's easier to read.</dd>

		<dt>Esc + Esc</dt>
		<dd>Clear the search field</dd>
	</dl>
</div>
<script>
	import ExternalLink from "../ExternalLink.svelte";
	import Icon from '../Icon.svelte';
	const jishoSearchBookmarklet = `javascript:(function() {
			const selection = window.getSelection().toString();
			if (selection) {
				window.open('https://jisho.org/search/' + encodeURIComponent(selection))
			}
		}())
		`
</script>