import {derived, writable} from "svelte/store";
const cloneObject = obj => JSON.parse(JSON.stringify(obj));

export const word = writable('');
export const reading = writable('');
export const source = writable('');
export const definition = writable('');

export const card = derived([
	word, reading, definition
], ([word, reading, definition]) => {
	return {
		id: definition ? definition.href : '',
		word, reading, definition
	}
})

export const selectDefinition = (src, def, alternate={}) => {
	word.set(alternate.word || def.word);
	reading.set(alternate.reading || def.reading || def.word);
	definition.set(cloneObject(def));
	source.set(src)
}

export const resetCard = () => {
	word.set('');
	reading.set('');
	source.set('');
	definition.set('');
}