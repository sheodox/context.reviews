<style>
    .panel {
        margin: 1rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: transparent;
    }
	h1 {
		text-align: center;
		font-size: 2.75rem;
		margin: 0;
	}
    h2 {
		font-size: 2.5rem;
		text-align: center;
		margin: 0;
	}
	* + h2, * + h1 {
		margin-top: 2rem;
	}
    .panel-body {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    video, img {
        max-width: 100%;
    }
    .outlined, img, video {
        border: 1px solid var(--accent-purple);
    }
	.row {
		display: flex;
		align-items: start;
	}
	.row > * {
		flex: 1;
		margin: 0.5rem;
	}
	@media (max-width: 800px) {
		.row {
			flex-direction: column;
			align-items: center;
			margin: 0;
		}
		.row > * {
			margin: 0;
		}
        .panel {
			padding: 1rem;
		}
	}
    p {
		line-height: 1.7;
		text-align: center;
	}
</style>

<div class="panel">
	<div class="row">
		<div>
			<h1>Study Japanese Using Anything</h1>
			<div>
				<p>
					Context.Reviews aims to make studying Japanese more interesting by helping you learn the vocabulary
					you encounter. Words you encounter in native material are more memorable than drilling pre-made
					decks, not to mention more fun!
				</p>
				<p>
					As you're reading any Japanese material of your choosing, look up sentences containing words you don't yet know
					on <ExternalLink href="https://jisho.org">Jisho.org</ExternalLink>, then come back here to quickly create
					a beautiful <ExternalLink href="https://apps.ankiweb.net/">Anki flashcard deck</ExternalLink> out of everything you just learned!
				</p>
			</div>
		</div>

		<aside class="outlined">
			<DemoCard />
		</aside>
	</div>

	<h2>
		Effortlessly Create Anki Cards
	</h2>
	<p>
		You can create <ExternalLink href="https://apps.ankiweb.net/">Anki flashcards</ExternalLink> just by selecting the unknown words in each context sentence you looked up.
		Making good Anki cards usually takes time, but this makes it quick and easy!
	</p>
	<p>
		Definitions are automatically pulled from Jisho, and your context sentence is always included on the card to make understanding the definition in context easier and more memorable!
		You're also able to customize everything about the cards so you're not limited to Jisho definitions!
	</p>
	<video muted autoplay loop controls src="/videos/anki-export-demo.mp4" />

	<h1>How Does It Work?</h1>

	<h2>
		Automatically Record Searches
	</h2>

	<p>
		Phrases you look up on Jisho will automatically get recorded to Context.Reviews with a browser extension.
		As you're reading you can look up unknown words without having to write anything down to study later.
	</p>
	<img src="/images/extension-demo.png" alt="demo screenshot of the browser extension on Jisho.org"/>

	<h2>
		Look Back At Your Searches
	</h2>

	<p>
		After you're done reading, you can look back at everything you had searched and review before creating Anki cards.
	</p>
	<p>
		Just like the Anki Export wizard selected text will pull definitions from Jisho, and gives you quick links to some other popular dictionary and search websites.
	</p>
	<img src="/images/list-demo.png" alt="demo screenshot of the phrase list">

	<h2>
		Add Phrases In Bulk
	</h2>
	<p>
		If you don't want to use the browser extension, or want to import a bunch of phrases at once, you can also add phrases manually in bulk!
	</p>

	<img src="/images/bulk-add-phrase-demo.png" alt="demo screenshot of the bulk phrase addition dialog">

	<h1>
		Start Studying With Your Own Decks
	</h1>
	<GetStarted />
</div>

<script>
	import ExternalLink from "../ExternalLink.svelte";
	import DemoCard from './DemoCard.svelte';
	import GetStarted from "./GetStarted.svelte";
</script>