module.exports = phrase => {
    const remove = regex => {
        phrase = phrase.replace(regex, '');
    };
    
    phrase = phrase.trim();
    //dangling punctuation/symbols from the previous sentence
    remove(/^[。、」]/);
    //dangling quotes for the next sentence
    remove(/「$/);
    
    //unmatched quotes
    const leadingQuote = /^「/,
        trailingQuote = /」$/;
    //starts with an opening quote but doesn't have any closing quotes, assume only part of a quote was selected, no need to keep in quotes
    if (leadingQuote.test(phrase) && !phrase.includes('」')) {
        remove(leadingQuote);
    }
    //same with closing quote
    if (trailingQuote.test(phrase) && !phrase.includes('「')) {
        remove(trailingQuote);
    }
    //if a full quote was selected only, no need for the quote marks
    if (trailingQuote.test(phrase) && leadingQuote.test(phrase)) {
        remove(leadingQuote);
        remove(trailingQuote);
    }
    return phrase;
};
