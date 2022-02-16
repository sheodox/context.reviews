export const quoteCharacters = [
	['「', '」'],
	['『', '』'],
	['【', '】'],
];

export const trim = (phrase: string) => {
	const remove = (regex: RegExp) => {
		phrase = phrase.replace(regex, '').trim();
	};
	phrase = phrase.trim();

	//dangling punctuation/symbols from the previous sentence
	remove(/^[。、！]/);
	//dangling commas
	remove(/[、]$/);

	//if they look up something in english don't count that as a word to review (they can look up the result if they really want it to show up)
	remove(/^[\w\d\s]*$/);

	//remove messy copying (extra punctuation for other sentences), and remove quotes when they're not necessary for the quote.
	//we don't want to remove quotes if it's something like "「うるさいだまれ」って言った" because it changes the meaning.
	quoteCharacters.forEach(([open, close]) => {
		const leadingOpen = new RegExp('^' + open),
			leadingClose = new RegExp('^' + close),
			trailingClose = new RegExp(close + '$'),
			trailingOpen = new RegExp(open + '$');

		//starts with an opening quote but doesn't have any closing quotes, assume only part of a quote was selected, no need to keep in quotes
		if (leadingOpen.test(phrase) && !phrase.includes(close)) {
			remove(leadingOpen);
		}
		//same with closing quote
		if (trailingClose.test(phrase) && !phrase.includes(open)) {
			remove(trailingClose);
		}

		//a full quote with quote marks was included and nothing outside it, just remove the quote, it's unnecessary
		if (leadingOpen.test(phrase) && trailingClose.test(phrase)) {
			remove(leadingOpen);
			remove(trailingClose);
		}

		//remove any quotes for quotes that weren't included in the phrase
		remove(trailingOpen);
		remove(leadingClose);
	});

	return phrase;
};

export const splitIntoPhrases = (phrase: string) => {
	phrase = phrase.replace(/\r/g, '');
	//insert newlines after sentences, and split on those. this can be also used
	//to intentionally split text when bulk adding phrases
	const delimiter = '\n';
	['。', '！', '？'].forEach((punctuation) => {
		phrase = phrase.replace(new RegExp(punctuation, 'g'), `${punctuation}${delimiter}`);
	});
	//split between quotes that are right next to each other, like "something」「something else"
	quoteCharacters.map(([open, close]) => {
		phrase = phrase.replace(new RegExp(`${close}\\s*${open}`, 'g'), `${close}\n${open}`);
	});
	return phrase.split(delimiter).filter((phrase) => !!phrase);
};
