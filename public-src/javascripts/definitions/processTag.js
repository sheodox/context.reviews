export let tag = '';
const MAX_WK_LEVEL = 60;

export function analyzeTag(tag) {
	let type = '',
		text = '',
		styles = '';

	if (tag === 'common') {
		type = 'common';
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
		type = 'wanikani';
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
	return {
		text,
		type,
		styles
	}
}
