<style>
	.tag {
		color: #8293a1;
		border: 1px solid #8293a1;
		font-size: 0.7rem;
		padding: 0 0.2rem;
		border-radius: 2px;
	}
	.tag.common {
		color: #00ffac;
		border-color: #00ffac;
	}
	.tag.wanikani {
		border-color: #82216f;
		color: white;
		text-shadow: 0 0 1px black;
	}
	.tag:not(:last-of-type) {
		margin-right: 0.3rem;
	}
</style>

<span class="tag {type}" style={styles}>{text}</span>

<script>
	import {analyzeTag} from './processTag';
	export let tag = '';
	const MAX_WK_LEVEL = 60;

	let type = '',
		text = '',
		styles = '';

	$: {
		const processed = analyzeTag(tag);
		text = processed.text;
		type = processed.type;
		styles = processed.styles;
	}
</script>