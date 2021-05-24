<style>
    .card {
        border: 2px solid var(--shdx-gray-300);
        border-radius: 3px;
    }
    .short {
        width: 3em;
    }
    .medium {
        width: 4em;
    }
    .long {
        width: 6em;
    }
    .front .text-shape {
        height: var(--shdx-font-size-7);
    }
    .text-shape {
        height: var(--shdx-font-size-4);
    }
    .text-shape.text {
        background: var(--shdx-gray-75);
    }
    .text-shape.text-muted {
        background: var(--shdx-gray-100);
    }
    .text-shape.highlight-text {
        background: var(--shdx-blue-300);
    }
    .line {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>

<div class="card m-3 p-3">
    <div class="front f-row justify-content-center">
        {#if variant === 'word'}
            <div class="text-shape highlight-text short"></div>
        {:else}
            <div class="line">
                <div class="text-shape text medium"></div>
                <div class="text-shape highlight-text short"></div>
                <div class="text-shape text long"></div>
            </div>
        {/if}
    </div>
    <hr>
    <div class="back f-column gap-1">
        <div class="line">
            <div class="text-shape short text-muted"></div>
            <div class="text-shape long text"></div>
        </div>
        <div class="line">
            <div class="text-shape medium text-muted"></div>
            <div class="text-shape short text"></div>
        </div>
        <div class="line">
            <div class="text-shape short text-muted"></div>
            <div class="text-shape long text"></div>
        </div>
    </div>
</div>

<script>
    export let variant; //word | context
</script>