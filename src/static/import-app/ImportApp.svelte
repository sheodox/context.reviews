<style lang="scss">
	.import-type {
		border: 2px solid var(--sx-gray-500);
		border-radius: 10px;
		text-align: center;
		font-weight: bold;
		color: var(--sx-blue-300);
		transition: border-color 0.1s, background-color 0.1s;

		&:hover {
			border-color: var(--sx-blue-600);
			background-color: var(--sx-gray-600);
			box-shadow: 0 0 1.5rem var(--sx-blue-700);

			.type-description {
				color: white;
			}
		}

		.type-description {
			position: block;
			color: var(--sx-gray-75);
			max-width: 10rem;
		}
	}
	@media (max-width: 700px) {
		.question {
			font-size: var(--sx-font-size-7) !important;
		}
		section {
			justify-content: start;
		}
	}
</style>

<section class="f-column align-items-center justify-content-center f-1 p-3">
	<p class="question sx-font-size-9">Where do you want to import your phrases from?</p>
	<div class="f-row flex-wrap gap-4">
		{#each importTypes as type}
			<a
				class="import-type f-column justify-content-start px-4 py-1"
				href={type.href}
				on:click|preventDefault={() => page(type.href)}
			>
				<p class="sx-font-size-9 m-1">
					<Icon icon={type.icon} />
				</p>
				<p class="type-name sx-font-size-5 mt-0">{type.name}</p>
				<p class="type-description sx-font-size-3">{type.description}</p>
			</a>
		{/each}
	</div>
</section>

<script lang="ts">
	import { Icon } from 'sheodox-ui';
	import page from 'page';

	const importTypes = [
		{
			name: 'Plain Text',
			description: 'Paste in any block of text',
			icon: 'list-alt',
			href: '/import/plain',
		},
		{
			name: 'Subtitles',
			description: 'Upload a subtitle file (.srt or .ass)',
			icon: 'closed-captioning',
			href: '/import/subtitles',
		},
	];
</script>
