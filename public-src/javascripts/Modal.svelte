<style>
    .overlay {
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background: rgba(0, 0 ,0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .modal {
        max-width: 90vw;
        border-radius: 0.3rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        max-height: 90vh;
	}
    .modal-title {
        display: flex;
        flex-direction: row;
		padding: 1rem;
	}
    h1, button.close {
        align-self: center;
    }
    h1 {
        flex: 1;
    }
    .modal-body {
        flex: 1;
        overflow: auto;
    }
    h1 {
        margin: 0;
    }
    .header {
        background: var(--panel-header-bg);
    }
</style>

<div class="overlay" on:click={() => visible = false}>
    <div class="modal panel" on:click|stopPropagation>
        <div class="modal-title header">
            <h1>{title}</h1>
            <button class="close" on:click={() => visible = false}>
                <Icon icon="close" />
                <span class="sr-only">Close modal</span>
            </button>
        </div>
        <div class="modal-body">
            <slot />
        </div>
    </div>
</div>

<script>
    import Icon from './Icon.svelte';
    export let title = '';
    export let visible = false;
</script>