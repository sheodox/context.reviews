<style>
	.tag:not(:last-of-type) {
		margin-right: 0.3rem;
	}
</style>

<span class="tag" style={styles}>{text}</span>

<script>
	import {analyzeTags} from "./processTag";

	export let text = '';
	export let styles = '';
	// tag can be specified optionally, this is used on the custom definition "About Tags"
	// modal. since it doesn't go through analyzeTags in bulk it can't be de-duped so this
	// should only be used in demonstrations
	export let tag;

	$: if (tag) {
		[{text, styles}] = analyzeTags([tag]);
	}
</script>