const MAX_WK_LEVEL = 60;

function genStyles(overrides) {
	const genericGray = '#8293a1',
		styles = Object.assign({
			'font-size': '0.7rem',
			'padding': '0 0.2rem',
			'border-radius': '2px',
			'color': genericGray,
			'border': `1px solid ${genericGray}`
		}, overrides);

	return Object.entries(styles).reduce((style, styleProp) => {
		return style + styleProp.join(':') + ';'
	}, '')
}

export function analyzeTag(tag='') {
	let type = '',
		text = '',
		styleOverrides = {};

	if (tag === 'common') {
		const green = '#00ffac';
		styleOverrides = {
			color: green,
			'border-color': green
		};
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
		styleOverrides = {
			'color' : 'white',
			'border-color': fillColor,
			'background': `linear-gradient(
				to right,
				${fillColor},
				${fillColor} ${wkCompletionPercent - 10}%,
				${barEndColor} ${wkCompletionPercent}%,
				transparent ${wkCompletionPercent}%,
				transparent)`
		}
	}
	else {
		text = tag;
	}
	return {
		text,
		type,
		styles: genStyles(styleOverrides)
	}
}
