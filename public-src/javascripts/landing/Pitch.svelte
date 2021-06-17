<style>
	h1 {
		font-size: var(--shdx-font-size-11);
		margin: 0;
	}
	h2 {
		font-size: var(--shdx-font-size-9);
		margin: 0;
	}
	video, .pitch :global(img) {
		max-width: 100%;
	}
	.outlined, video, .pitch :global(img) {
		box-shadow: var(--shdx-shadow-5), var(--shdx-shadow-1);
		border-radius: 15px;
		overflow: hidden;
	}
	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-shrink: 0;
	}
	.row > * {
		flex: 1;
		flex-shrink: 0;
		max-width: 40rem;
		margin: 1rem 2.5rem;
	}
	.sub-title {
		font-size: var(--shdx-font-size-7);
	}
	p {
		max-width: 50rem;
		font-size: 1.1rem;
		line-height: 1.7;
	}
	p + :global(picture), p + video {
		margin-top: var(--shdx-spacing-8);
	}
	section {
		padding-top: var(--shdx-spacing-10);
		padding-bottom: var(--shdx-spacing-10);
		width: 100vw;
        display: flex;
        flex-direction: column;
		align-items: center;
	}
	section:nth-child(even) {
		background: var(--shdx-gray-800);
	}

	@media (max-width: 800px) {
		h1 {
			font-size: var(--shdx-font-size-8);
			text-align: center;
		}
		h2 {
			font-size: var(--shdx-font-size-7);
		}
		.sub-title {
			font-size: var(--shdx-font-size-6);
		}
		.row {
			flex-direction: column;
			align-items: center;
			margin: 0;
			padding-top: var(--shdx-spacing-3);
		}
		.row > * {
			margin: 0;
		}
		.pitch {
			padding: 0;
			margin: 0;
		}
		aside#demo-cards {
			width: auto;
		}
		p {
			max-width: 90vw;
			margin-left: auto;
			margin-right: auto;
		}
		aside#demo-cards {
			max-width: 95vw;
		}
	}
	aside#demo-cards {
		width: 25rem;
	}
	#try-me {
		background: var(--shdx-accent-gradient);
	}
</style>

<div class="pitch has-inline-links">
	<section class="row align-items-center">
		<div>
			<h1>Study Japanese Using Anything</h1>
			<div>
				<p class="sub-title">
					Study the words you want from the native material you like to read.
				</p>
			</div>
		</div>

		<aside id="demo-cards" class="outlined">
			<DemoCard />
			<p id="try-me" class="m-0 text-align-center">
				<Icon icon="arrow-up" />
				Try me
				<Icon icon="arrow-up" />
			</p>
		</aside>
	</section>

	<section>
		<h2>
			Effortlessly Create Anki Cards
		</h2>
		<p>
			Read whatever Japanese material you like and look up sentences containing words you don't yet know
			on <ExternalLink href="https://jisho.org">Jisho.org</ExternalLink> and the Context.Reviews browser extension will
			keep track of what you searched. When you're ready come back here to create
			a beautiful <ExternalLink href="https://apps.ankiweb.net/">Anki flashcard deck</ExternalLink> out of everything you just learned!
		</p>
		<p>
			Create Anki cards just by selecting a word.
			Definitions are pulled automatically from <ExternalLink href="https://jisho.org">Jisho</ExternalLink>, and you can customize it how you want.
		</p>

		<video muted autoplay loop controls src={asset('videos/anki-export-demo.mp4')} />
	</section>

	<section>
		<h2>Study Words in Isolation or in Context</h2>
		<div class="f-row f-wrap justify-content-center">
			<div class="m-6">
				<StyleCard variant="word" />
			</div>
			<div class="m-6">
				<StyleCard variant="context" />
			</div>
		</div>
	</section>

	<section>
		<h2>
			Automatically Record Searches
		</h2>

		<p>
			Phrases you look up on Jisho will automatically get saved with the Context.Reviews browser extension,
			meaning you can just focus on reading until you're ready to create your Anki deck!
		</p>
		<Image src="images/extension-demo" alt="demo screenshot of the browser extension on Jisho.org"/>
	</section>

	<section>
		<h2>
			Look Back At Your Searches
		</h2>

		<p>
			Manage your saved searches at any time.
			Selecting text will show definitions from Jisho and give you quick links to some other popular dictionaries and websites.
		</p>
		<Image src="images/list-demo" alt="demo screenshot of the phrase list" />
	</section>

	<section>
		<h1>
			Start Studying With Your Own Decks
		</h1>
		<GetStarted />
	</section>
</div>

<script>
	import ExternalLink from "../ExternalLink.svelte";
	import DemoCard from './DemoCard.svelte';
	import GetStarted from "./GetStarted.svelte";
	import Image from '../Image.svelte';
	import {Icon} from 'sheodox-ui';
	import {asset} from '../assets';
	import StyleCard from "../export-app/StyleCard.svelte";
</script>