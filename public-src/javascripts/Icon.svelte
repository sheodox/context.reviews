<style>
    i {
		font-size: initial;
		padding-right: 0.25rem;
        vertical-align: middle;
    }
	i.no-padding {
		padding: 0;
	}
	:global(button.small) i {
		font-size: 12px;
	}
</style>
<i class="material-icons md-light" class:no-padding={noPadding}>{icon}</i>
<script>
    export let icon;
    export let noPadding = false;
</script>