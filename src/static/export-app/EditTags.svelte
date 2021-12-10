<style>
	.tags-editor {
		display: flex;
		flex-direction: row;
	}
	.help-modal {
		margin: 1rem;
		max-width: 30rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	table {
		text-align: center;
		background: var(--shdx-bg);
		border-radius: 0.2rem;
	}
</style>

<div class="tags-editor">
	<TextInput value={tagsText} id="definition-editor-word" on:keyup={updateTags}>Tags</TextInput>
	<button on:click={() => (showHelp = true)} class="small">
		<Icon icon="info-circle" />
		About Tags
	</button>
</div>

{#if showHelp}
	<Modal bind:visible={showHelp} title="About Tags">
		<div class="help-modal">
			<p>
				Tags are used to describe things about the word other than its meaning or usage, like a JLPT level. You can
				enter any tag you want, but there are some special tags that automatically get special styling.
			</p>
			<table>
				<thead>
					<tr>
						<th>Tag Text</th>
						<th>Special Styling</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>common</td>
						<td>
							<Tag tag="common" />
						</td>
					</tr>
					<tr>
						<td>jlpt-n3</td>
						<td>
							<Tag tag="jlpt-n3" />
						</td>
					</tr>
					<tr>
						<td>wanikani32</td>
						<td>
							<Tag tag="wanikani32" />
						</td>
					</tr>
				</tbody>
			</table>

			<p>You can add any tags you want, separated by commas.</p>
		</div>
	</Modal>
{/if}

<script lang="ts">
	import { Modal, Icon, TextInput } from 'sheodox-ui';
	import Tag from '../definitions/Tag.svelte';

	export let tags: string[] = [];
	let tagsText = '',
		showHelp = false;

	$: tagsText = tags.join(', ');

	function updateTags(e: Event) {
		tags = (e.target as HTMLInputElement).value
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => !!tag);
	}
</script>
