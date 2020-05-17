<style>
	.tag {
		color: #8293a1;
		border: 1px solid #1f2b3d;
		font-size: 0.7rem;
		padding: 0 0.2rem;
	}
	.tag.common {
		color: #00ffac;
	}
	.tag.wk {
		border-color: #82216f;
		color: white;
		text-shadow: 0 0 1px black;
	}
	.tag:not(:last-of-type) {
		margin-right: 0.3rem;
	}
</style>

<span class="tag {classes}" style={styles}>{text}</span>

<script>
	export let tag = '';
	const MAX_WK_LEVEL = 60;

	let classes = '',
		text = '',
		styles = '';

	$: {
		if (tag === 'common') {
			classes = 'common';
			text = 'Common'
		}
		else if (tag.includes('jlpt')) {
			text = tag.toUpperCase().replace('-' , ' ');
		}
		else if (tag.includes('wanikani')) {
			const wkLevel = parseInt(tag.replace(/\D*/, ''), 10),
				fillColor = '#82216f',
				barEndColor = '#d243ba',
				wkCompletionPercent = (wkLevel / MAX_WK_LEVEL) * 100;

			text = `Wanikani ${wkLevel}`;
			classes = 'wk';
			styles = `background: linear-gradient(
				to right,
				${fillColor},
				${fillColor} ${wkCompletionPercent - 10}%,
				${barEndColor} ${wkCompletionPercent}%,
				transparent ${wkCompletionPercent}%,
				transparent)`;
		}
		else {
			text = tag;
		}
	}
</script>