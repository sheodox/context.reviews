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

export function analyzeTags(tags=[]) {
	const jlptReg = /jlpt-n([1-5])/,
		//get the number (parsed as a number) from a JLPT tag like 'jlpt-n3'
		getJLPTLevel = (tag='') => {
			const jlptMatch = tag.match(jlptReg);
			if (jlptMatch) {
				return parseInt(
					jlptMatch[1],
					10
				)
			}
		};

	//jisho often gives more than one JLPT level, they seem to only show
	//the lowest difficulty (i.e. it'll show just n4 given n3 and n4).
	const lowestJLPT = tags.reduce((lowest, tag) => {
		if (jlptReg.test(tag)) {
			return Math.max(lowest, getJLPTLevel(tag));
		}
		return lowest;
	}, 0);

	//wanikani levels don't seem to be de-duped like JLPT levels.
	//for example 絶つ currently shows both level 23 and 28

	return tags
		.filter(tag => {
			if (!jlptReg.test(tag)) {
				return true;
			}

			//filter out any higher difficulty JLPT tags
			return getJLPTLevel(tag) === lowestJLPT;
		})
		.map(tag => {
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
				text = `JLPT N${getJLPTLevel(tag)}`;
			}
			else if (tag.includes('wanikani')) {
				const wkLevel = parseInt(tag.replace(/\D*/, ''), 10),
					fillColor = '#82216f',
					barEndColor = '#d243ba',
					wkCompletionPercent = (wkLevel / MAX_WK_LEVEL) * 100;

				text = `Wanikani ${wkLevel}`;
				styleOverrides = {
					'color': 'white',
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
		});
}
