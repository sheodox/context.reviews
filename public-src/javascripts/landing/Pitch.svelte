<style>
    .panel {
        margin: 1rem;
    }
    h2 {
        margin: 0;
        font-size: 2rem;
		text-align: center;
	}
    h3 {
        font-size: 1.8rem;
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
</style>

<div class="panel">
	<h2 class="header">Make any Japanese text a study resource!</h2>
    <div class="panel-body">
		<h3>Easily Study New Words!</h3>
		<p>
			As you're reading any Japanese material of your choosing, look up sentences containing words you don't yet know
            on <ExternalLink href="https://jisho.org">Jisho.org</ExternalLink>, then come back here to quickly create
            a beautiful Anki deck out of everything you just learned!</p>
        <div class="outlined">
			<DemoCard />
        </div>

		<h3>Anki Card Builder</h3>
		<p>
			Create Anki cards just by selecting the unknown words in each context sentence you looked up.
		</p>
		<video muted autoplay loop controls src="/videos/anki-export-demo.mp4" class="outlined" />
    </div>
</div>

<script>
	import ExternalLink from "../ExternalLink.svelte";
    import DemoCard from './DemoCard.svelte';
</script>