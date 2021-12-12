<a {href} class={classes} on:click|preventDefault={follow}>
	<slot />
</a>

<script lang="ts">
	import page from 'page';

	export let href: string;
	export let classes = '';

	function follow() {
		page(href);
	}
</script>
