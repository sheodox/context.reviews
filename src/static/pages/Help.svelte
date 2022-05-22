<style>
	dt {
		font-weight: bold;
	}
	a:not(:hover) {
		text-decoration: none;
	}
	p {
		margin-top: 0.4rem;
		margin-right: 0.4rem;
	}
	p.hint {
		margin: 1rem 2rem;
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
	kbd {
		border: 1px solid var(--sx-gray-200);
		border-bottom-width: 3px;
		border-radius: 3px 3px 0 0;
		padding: 0 0.3rem;
		background: var(--sx-gray-300);
	}
	strong.nav-link-example {
		border-bottom: 0.2rem solid var(--sx-accent-mint);
	}
	.result {
		/* imitate the button text color */
		color: var(--sx-accent-blue);
	}
</style>

<Layout title="Help" {showBackLink}>
	<div class="container has-inline-links">
		<TabList {tabs} bind:selectedTab />

		<Tab tabId="help-setup" {selectedTab}>
			<h2>Setup</h2>
			<p>
				First install the browser extension which will automatically keep track of all of the <ExternalLink
					href="https://jisho.org">Jisho.org</ExternalLink
				> searches you make for Japanese words and phrases.
			</p>
			<p>
				<ExternalLink href="https://addons.mozilla.org/en-US/firefox/addon/context-reviews/"
					>Install for Firefox</ExternalLink
				>
				-
				<ExternalLink href="https://chrome.google.com/webstore/detail/contextreviews/epfpaalbjmjbplcegbkjiekehecfjjjp"
					>Install for Chrome</ExternalLink
				>
			</p>
			<h2>Usage</h2>
			<ol>
				<li>
					Look up sentences containing unknown words as you read some Japanese.
					<br />
					<p class="hint">
						<Icon icon="info" />
						<strong>Hint!</strong> Drag this link to your bookmark bar:
						<a href={jishoSearchBookmarklet}>Jisho Search</a>. When you are reading a web page you can select some
						Japanese text then click that bookmark to quickly open a Jisho search!
					</p>
				</li>
				<li>
					Return here to review and export to an Anki deck using the <strong class="nav-link-example"
						><Icon icon="clone" />Anki Export</strong
					>
					link at the top of the page.
					<p class="hint">
						<Icon icon="info" />
						<strong>Hint!</strong>
						If you use Jisho to search for full sentences you'll see it included as a context sentence on the back of the
						Anki cards.
					</p>
				</li>
			</ol>
		</Tab>

		<Tab tabId="help-list" {selectedTab}>
			<h2>Usage</h2>
			<p>
				The phrase list is the first page you land on when you log in. From here you can view and manage all of your
				saved phrases. If you highlight some text in a phrase the Jisho definition search results will automatically
				show up in the side bar on the right!
			</p>

			<h2>Hotkeys</h2>

			<dl>
				<dt><kbd>s</kbd> (when not in a text input field)</dt>
				<dd>Focus the search input.</dd>

				<dt><kbd>Ctrl</kbd> + <kbd>z</kbd> (when not in the search field)</dt>
				<dd>Undo the last phrase deletion.</dd>

				<dt><kbd>Ctrl</kbd> + <kbd>Enter</kbd></dt>
				<dd>Add the first Jisho search result to the phrase list.</dd>

				<dt>Hover Japanese words in the definition search</dt>
				<dd>
					Hover over a word with furigana for a moment and the word and furigana will get bigger so it's easier to read.
				</dd>

				<dt><kbd>Esc</kbd> + <kbd>Esc</kbd></dt>
				<dd>Clear the search field</dd>
			</dl>
		</Tab>

		<Tab tabId="help-export" {selectedTab}>
			<h2>Usage</h2>
			<p>
				Here is where the magic happens! You'll be shown phrases one-by-one, just highlight the word in the phrase that
				you want to study and choose the definition that's most applicable from the definitions that show then click
				"Add Card".
			</p>

			<p>
				The primary spelling from the Jisho result is used automatically used, but if you prefer an alternate spelling
				you can click on one of the alternates shown below the definition or you can manually type whatever spelling and
				reading you want.
			</p>

			<p>
				Finally, many things on the card can be customized to your liking including the meanings, tags, parts of speech,
				etc. By clicking "Customize Card" next to your chosen definition you can change whatever you want.
			</p>

			<h2>Definition Suggestions</h2>
			<p>
				When searching for a definition parts of relevant definitions will be highlighted based on a few different
				scenarios to try help you decide quickly which words or forms you want to learn.
			</p>

			<table>
				<thead>
					<tr>
						<th>Search Terms</th>
						<th>Result</th>
						<th>Explanation</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>人気</td>
						<td class="result">
							<JapaneseWord word="人気" reading="にんき" wordComparison="人気" />
						</td>
						<td>Exact matches are highlighted and emphasized.</td>
					</tr>
					<tr>
						<td>食べました</td>
						<td class="result">
							<JapaneseWord word="食べる" reading="たべる" wordComparison="食べました" />
						</td>
						<td
							>Parts of words that match your search term will be highlighted, you will often see this when you
							searching a conjugated form.</td
						>
					</tr>
					<tr>
						<td>まったく</td>
						<td class="result">
							<JapaneseWord word="全く" reading="まったく" wordComparison="まったく" />
						</td>
						<td>Words that don't start with the same character as your search term aren't considered a match.</td>
					</tr>
				</tbody>
			</table>
		</Tab>
	</div>
</Layout>

<script lang="ts">
	import Layout from './Layout.svelte';
	import ExternalLink from '../ExternalLink.svelte';
	import { Icon, TabList, Tab } from 'sheodox-ui';
	import JapaneseWord from '../definitions/JapaneseWord.svelte';

	export let showBackLink = true;

	const tabs = [
		{
			id: 'help-setup',
			title: 'Setup',
		},
		{
			id: 'help-list',
			title: 'Phrase List',
		},
		{
			id: 'help-export',
			title: 'Anki Export',
		},
	];
	let selectedTab: string;

	const jishoSearchBookmarklet = `javascript:(function() {
			const selection = window.getSelection().toString();
			if (selection) {
				window.open('https://jisho.org/search/' + encodeURIComponent(selection))
			}
		}())
		`;
</script>
