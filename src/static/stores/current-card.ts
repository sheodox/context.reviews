import { derived, writable } from 'svelte/store';
import { Definition, JapaneseForm } from '../../shared/types/definitions';
import { cards, cardStyle } from './cards';
import type { Card } from '../types/cards';

const cloneObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const word = writable<string>('');
export const wordHighlightRange = writable(null);
export const reading = writable<string>('');
export const beforeNotes = writable<string>('');
export const afterNotes = writable<string>('');
export const source = writable<string>('');
export const context = writable<string>(null);
export const definition = writable<Definition>(null);
export const definitionSearchTerm = writable<string>('');

export const card = derived<any, Card>(
	[word, wordHighlightRange, reading, context, definition, source, cardStyle, beforeNotes, afterNotes],
	([word, wordHighlightRange, reading, context, definition, source, cardStyle, beforeNotes, afterNotes]) => {
		return {
			id: definition ? definition.href : '',
			word,
			wordHighlightRange,
			reading,
			context,
			definition,
			source,
			cardStyle,
			beforeNotes,
			afterNotes,
		};
	}
);

export const wordIsUnique = derived<any, boolean>([cards, word], ([cards, word]) => {
	return !cards.some((card: Card) => card.word === word);
});

export const selectDefinition = (src: string, def: Definition, alternate?: JapaneseForm) => {
	word.set(alternate?.word || def.word);
	reading.set(alternate?.reading || def.reading || def.word);
	definition.set(cloneObject(def));
	source.set(src);
};

export const resetCard = () => {
	word.set('');
	wordHighlightRange.set(null);
	reading.set('');
	source.set('');
	definition.set(null);
	definitionSearchTerm.set('');
	beforeNotes.set('');
	afterNotes.set('');
};

export const suggestUseKana = derived([definition, definitionSearchTerm], ([definition, searchTerm]) => {
	return (
		definition &&
		definition.meanings.some(({ info }) => info.includes('Usually written using kana alone')) &&
		//don't suggest to use the kana spelling if the main definition is what you searched for, in that case you likely
		//searched for it because you found it somewhere and if a resource is using the non-kana spelling it
		//is probably more useful for you to learn the dictionary form to better understand what you're reading.
		//それ is usually kana only, but if you read a book that uses 其れ it'll probably spell it that way again so learn it!
		searchTerm !== definition.word
	);
});
export const useKanaTooltip = derived([suggestUseKana], ([suggested]) => {
	const base =
		'Some words are usually spelled with kana only, if you want to study the kana only version of this word click this button to study the reading instead.';
	return (
		base + (suggested ? `\n\nOne of the meanings for this definition says it's usually spelled with only kana.` : '')
	);
});
