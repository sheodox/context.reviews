<style>
	td :global(.phrase-action) {
		font-size: var(--shdx-font-size-2);
		background: var(--shdx-gray-600);
	}
	.buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
	button {
		white-space: nowrap;
		padding: 0.4rem;
	}
	.phrase {
		font-size: 1.3rem;
	}
	td :global(button) {
		padding: 0.4rem;
	}
	@media (max-width: 950px) {
		.buttons {
			flex-direction: column;
		}
	}
</style>

<tr>
	<td class="buttons">
		<button on:click={deletePhrase} class="phrase-action">
			Delete
		</button>
		<MenuButton triggerClasses="phrase-action">
			<span slot="trigger" class="menu-button">
				<Icon icon="chevron-down" noPadding={true} />
				<span class="sr-only">Actions</span>
			</span>
            <ul slot="menu">
                <li>
					<button on:click={define} class="a">
						<Icon icon="external-link-alt" />
						Jisho
					</button>
				</li>
                <li>
					<button on:click={() => copyToClipboard(phrase.phrase)} class="a">
						<Icon icon="copy" />
						Copy
					</button>
				</li>
				<li>
					<button class="a" on:click={edit}>
						<Icon icon="edit" />
						Edit
					</button>
				</li>
                <li>
					{#if $settings.speechSynthesis}
						<button on:click={read} class="a">
							<Icon icon="play" />
							Say
						</button>
					{/if}
				</li>
			</ul>
		</MenuButton>
	</td>
	<td class="phrase jp">
		<SelectableText text={phrase.phrase} on:text-select />
	</td>
</tr>

<script>
	import {say} from '../speech';
	import phraseStore from '../phraseStore';
	import {copyToClipboard} from "../utils";
	import SelectableText from "../SelectableText.svelte";
	import {settings} from "../metadataStore";
	import {Icon, MenuButton} from 'sheodox-ui';

	export let phrase = '';

	async function deletePhrase() {
		await phraseStore.action(`remove/${phrase.id}`);
	}

	function define() {
		window.open(`https://jisho.org/search/${encodeURIComponent(phrase.phrase)}`);
	}

	async function edit() {
		const newPhraseText = (prompt("Edit this phrase", phrase.phrase) || '').trim();
		if (newPhraseText) {
			await phraseStore.action(`/edit/${phrase.id}/${encodeURIComponent(newPhraseText)}`)
		}
	}

	function read() {
		say(phrase.phrase);
	}
</script>
