import { get, writable, derived } from 'svelte/store';
import phraseStore from './phrases';
import type { Card, CardStyle } from '../types/cards';
import type { Phrase } from '../../shared/types/phrases';

export type CardsByPhrase = Map<string, Card[]>;

//whether the context sentence is a part of the front of a card.
//this allows users to be tested on words in context.
export const cardStyle = writable<CardStyle>('word'); // 'word' | 'context'

//a Map of phrases and their respective arrays of card objects for each phrase
export const cardsByPhrase = writable<CardsByPhrase>(new Map());

//a store containing a boolean of if they've downloaded the deck (resets to false
//when cards are added. it's used to prevent them from accidentally
//navigating away if they've not downloaded the deck yet.
export const downloadedDeck = writable(false);
//when a deck has been imported into anki with Anki-Connect
export const deckImported = writable(false);

export const deckConsumed = derived([downloadedDeck, deckImported], ([downloaded, imported]) => {
	return downloaded || imported;
});

// if we're at the end of the phrases, or the user clicked Export, and we're supposed to
// be showing the page to download/export the generated cards
export const showExport = writable(false);
// whether an action has been taken to delete phrases after exporting
export const phrasesDeleted = writable(false);

function primeMap(baseMap: CardsByPhrase, phraseList: Phrase[]) {
	phraseList.forEach((phrase) => {
		if (!baseMap.has(phrase.phrase)) {
			baseMap.set(phrase.phrase, []);
		}
	});
	return new Map(baseMap);
}

export const setPhrases = (phraseList: Phrase[]) => {
	if (!phraseList) {
		return;
	}
	cardsByPhrase.update((phraseMap) => primeMap(phraseMap, phraseList));
};

export const addCard = (card: Card) => {
	cardsByPhrase.update((cardsByPhrase) => {
		//TODO ensure no other cards have this word
		const phrase = cached.get(currentPhrase),
			currentCards = cardsByPhrase.get(phrase);
		cardsByPhrase.set(phrase, [...currentCards, card]);
		//if they've previously downloaded the deck but added new cards since then their download doesn't contain everything
		downloadedDeck.set(false);
		return new Map(cardsByPhrase);
	});
};
export const removeCard = (card: Card) => {
	cardsByPhrase.update((cardsByPhrase) => {
		const phrase = cached.get(currentPhrase),
			currentCards = cardsByPhrase.get(phrase);
		currentCards.splice(currentCards.indexOf(card), 1);
		return new Map(cardsByPhrase);
	});
};

//the index of the phrase for which cards are currently being made
export const currentPhraseIndex = writable(0);

//the phrase text for the current phrase that's being used to create cards
export const currentPhrase = derived([phraseStore, currentPhraseIndex], ([phrases, currentPhraseIndex]) => {
	return phrases && phrases.length > currentPhraseIndex ? phrases[currentPhraseIndex].phrase : '';
});

//the number of phrases created for the current phrase
export const currentPhraseCardCount = derived([cardsByPhrase, currentPhrase], ([cardsByPhrase, currentPhrase]) => {
	if (!currentPhrase) {
		return 0;
	}
	return (cardsByPhrase.get(currentPhrase) || []).length;
});

//a flat array of all the cards that have been created, derived from cardsByPhrase
export const cards = derived<any, Card[]>(cardsByPhrase, (cardsByPhrase: CardsByPhrase) => {
	return Array.from(cardsByPhrase.values()).flat();
});

//a count of the number of cards that have been created
export const cardCount = derived(cards, (cards) => cards.length);

//a count of the number of phrases that have cards created for them
export const usedPhrases = derived(cards, (cards) => {
	//can't just do `return Array.from(cardsByPhrase.keys())` because it would include all phrases
	//because even if they don't have cards, they're initialized with an empty array.
	const phraseSet = new Set();
	cards.forEach(({ context }) => phraseSet.add(context));
	return Array.from(phraseSet);
});

export const unusedPhrases = derived([usedPhrases, phraseStore], ([used, phrases]) => {
	return (phrases || []).filter((phrase) => {
		return !used.includes(phrase.phrase);
	});
});

export function reset() {
	//re-prime cardsByPhrase with the current list
	cardsByPhrase.set(primeMap(new Map(), get(phraseStore)));
	currentPhraseIndex.set(0);

	showExport.set(false);
	phrasesDeleted.set(false);
	downloadedDeck.set(false);
	deckImported.set(false);
}

//subscribe to all stores so they can be used internally without `get()`
const cached = new Map();
[cardsByPhrase, currentPhraseIndex, currentPhrase, currentPhraseCardCount, cards, cardCount, usedPhrases].forEach(
	(store) => {
		store.subscribe((val) => {
			cached.set(store, val);
		});
	}
);
