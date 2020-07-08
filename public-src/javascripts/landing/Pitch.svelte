<style>
    .panel {
        margin: 1rem;
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
	}
	.row > * {
		flex: 1;
	}
	@media (max-width: 800px) {
		.row {
			flex-direction: column;
			align-items: center;
		}
	}
	h1 {
		font-size: 2.5rem;
		text-align: center;
	}
    p {
		line-height: 1.5;
	}
</style>

<h1>Make Any Japanese Text a Study Resource</h1>
<div class="row">
	<div class="panel">
		<div class="header">
			<h2>Easily Study New Words</h2>
		</div>
		<div class="panel-body">
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

<div class="panel">
        <h2 class="header">
			Anki Card Builder Wizard
		</h2>
	<div class="panel-body">
		<p>
			Create Anki cards just by selecting the unknown words in each context sentence you looked up.
		</p>
		<p>
			Making good Anki cards takes time, wizard should help make it a lot easier. Definitions are automatically pulled
			from Jisho, and your context sentence is always included on the card.
		</p>
		<video muted autoplay loop controls src="/videos/anki-export-demo.mp4" class="outlined" />
	</div>
</div>

<script>
	import ExternalLink from "../ExternalLink.svelte";
	import DemoCard from './DemoCard.svelte';
</script>