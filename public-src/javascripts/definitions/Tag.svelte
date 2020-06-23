<style>
	.tag:not(:last-of-type) {
		margin-right: 0.3rem;
	}
</style>

<span class="tag" style={styles}>{text}</span>

<script>
	import {analyzeTag} from './processTag';
	export let tag = '';
	const MAX_WK_LEVEL = 60;

	let text = '',
		styles = '';

	$: {
		const processed = analyzeTag(tag);
		text = processed.text;
		styles = processed.styles;
	}
</script>