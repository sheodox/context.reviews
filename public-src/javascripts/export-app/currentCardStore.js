import {derived, writable} from "svelte/store";
import {cards, cardStyle} from './cardsStore';
const cloneObject = obj => JSON.parse(JSON.stringify(obj));

export const word = writable('');
export const wordHighlightRange = writable(null);
export const reading = writable('');
export const source = writable('');
export const context = writable('');
export const definition = writable('');

export const card = derived([
	word, wordHighlightRange, reading, context, definition, source, cardStyle
], ([word, wordHighlightRange, reading, context, definition, source, cardStyle]) => {
	return {
		id: definition ? definition.href : '',
		word, wordHighlightRange, reading, context, definition, source, cardStyle
	}
})

export const wordIsUnique = derived([cards, word], ([cards, word]) => {
	return !cards.some(card => card.word === word);
})

export const selectDefinition = (src, def, alternate={}) => {
	word.set(alternate.word || def.word);
	reading.set(alternate.reading || def.reading || def.word);
	definition.set(cloneObject(def));
	source.set(src)
}

export const resetCard = () => {
	word.set('');
	wordHighlightRange.set(null);
	reading.set('');
	source.set('');
	definition.set('');
}