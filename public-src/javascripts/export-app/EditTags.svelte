<style>
    .tags-editor {
        display: flex;
        flex-direction: row;
    }
    label {
        flex: 1;
    }
    input {
        width: 100%;
    }
    button {
        align-self: end;
    }
    .help-modal {
        margin: 1rem;
        max-width: 30rem;
    }
    .help-modal ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .help-modal li {
        padding: 0.3rem;
    }
</style>

<div class="tags-editor">
    <label>
        Tags
		<br>
        <input value={tagsText} on:keyup={updateTags} />
    </label>
    <button on:click={() => showHelp = true}>
        <Icon icon="help" />
        About Tags
    </button>
</div>

{#if showHelp}
    <Modal bind:visible={showHelp} title="About Tags">
        <div class="help-modal">
			<p>
				Tags are used to describe things about the word other than its meaning or usage, like a JLPT level.
                You can enter any tag you want, but there are some special tags that automatically get special styling.
			</p>
            <ul>
                <li>
					common:
					<Tag tag="common" />
                </li>
                <li>
					jlpt-n3:
					<Tag tag="jlpt-n3" />
                </li>

                <li>
					wanikani32:
					<Tag tag="wanikani32" />
                </li>
			</ul>

            <p>
                You can give any tags you want, separated by commas.
            </p>
		</div>
	</Modal>
{/if}

<script>
    import Modal from '../Modal.svelte';
    import Icon from '../Icon.svelte';
    import Tag from '../definitions/Tag.svelte';

    export let tags = [];
    let tagsText = '',
        showHelp = false;

    $: tagsText = tags.join(', ');

    function updateTags(e) {
        tags = e.target.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => !!tag);
    }

</script>