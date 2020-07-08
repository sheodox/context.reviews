<style>
    .panel {
        margin: 1rem;
		padding: 2rem;
    }
    h2 {
        margin: 0;
        font-size: 2rem;
		text-align: center;
	}
    h2 {
        font-size: 1.8rem;
		margin: 0;
    }
    .panel-body {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    video {
        max-width: 100%;
    }
    .outlined {
        border: 1px solid var(--accent-purple);
    }
	.row {
		display: flex;
		align-items: start;
		margin-bottom: 2rem;
	}
	.row > * {
		flex: 1;
		margin: 1rem;
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
	h2 {
		font-size: 2.5rem;
		text-align: center;
		margin-top: 0.5rem;
	}
    p {
		line-height: 1.7;
		text-align: center;
	}
</style>

<div class="panel">
	<div class="row">
		<div>
			<h2>Study Japanese Using Anything</h2>
			<div>
				<p>
					Context.Reviews aims to make studying Japanese more interesting by helping you learn the vocabulary
					you encounter. Words you encounter in native material are more memorable than drilling pre-made
					decks, not to mention more fun!
				</p>
				<p>
					As you're reading any Japanese material of your choosing, look up sentences containing words you don't yet know
					on <ExternalLink href="https://jisho.org">Jisho.org</ExternalLink>, then come back here to quickly create
					a beautiful Anki deck out of everything you just learned!
				</p>
			</div>
		</div>

		<aside class="outlined">
			<DemoCard />
		</aside>
	</div>

	<h2>
		Anki Card Wizard
	</h2>
	<p>
		Create Anki cards just by selecting the unknown words in each context sentence you looked up.
	</p>
	<p>
		Making good Anki cards takes time, wizard should help make it a lot easier. Definitions are automatically pulled
		from Jisho, and your context sentence is always included on the card.
	</p>
	<video muted autoplay loop controls src="/videos/anki-export-demo.mp4" class="outlined" />
</div>

<script>
	import ExternalLink from "../ExternalLink.svelte";
	import DemoCard from './DemoCard.svelte';
</script>