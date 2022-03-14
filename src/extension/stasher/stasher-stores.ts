import { writable } from 'svelte/store';
import { Phrase } from '../extension-utils';

export const phrases = writable<Phrase[]>([]);

export function addPhrase(phrase: Phrase) {
	phrases.update((phrases) => {
		const existingIndex = phrases.findIndex((p) => phrase.phrase == p.phrase);
		if (existingIndex >= 0) {
			// update in place if we know about it, the status might have changed
			phrases[existingIndex] = phrase;
			return phrases;
		}

		return [...phrases, phrase];
	});
}

export const errorMessages = writable<string[]>([]);

export function showErrorMessage(msg: string) {
	errorMessages.update((msgs) => [...msgs, msg]);
}

export function removeErrorMessage(msg: string) {
	errorMessages.update((msgs) => msgs.filter((m) => m !== msg));
}
