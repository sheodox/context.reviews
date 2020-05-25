import {get, writable, derived} from 'svelte/store';
import phraseStore from "../phraseStore";
import {card} from "./currentCardStore";

export const cardsByPhrase = writable(new Map());

export const setPhrases = (phraseList) => {
	if (!phraseList) {
		return;
	}
	cardsByPhrase.update(phraseMap => {
		phraseList.forEach(phrase => {
			if (!phraseMap.has(phrase.phrase)) {
				phraseMap.set(phrase.phrase, []);
			}
		})
		return new Map(phraseMap);
	})
}

export const addCard = (card) => {
	cardsByPhrase.update(cardsByPhrase => {
		//TODO ensure no other cards have this word
		const phrase = cached.get(currentPhrase),
			currentCards = cardsByPhrase.get(phrase);
		cardsByPhrase.set(phrase, [...currentCards, card])
		return new Map(cardsByPhrase);
	});
};
export const removeCard = (phrase, card) => {
	cardsByPhrase.update(cardsByPhrase => {
		const phrase = cached.get(currentPhrase),
			currentCards = cardsByPhrase.get(phrase);
		currentCards.splice(currentCards.indexOf(card), 1 )
		return new Map(cardsByPhrase);
	});
}

export const currentPhraseIndex = writable(0);
export const currentPhrase = derived([phraseStore, currentPhraseIndex], ([phrases, currentPhraseIndex]) => {
	return phrases && phrases.length > currentPhraseIndex
		? phrases[currentPhraseIndex].phrase
		: '';
});
export const currentPhraseCardCount = derived([cardsByPhrase, currentPhrase], ([cardsByPhrase, currentPhrase]) => {
	if (!currentPhrase) {
		return 0;
	}
	return cardsByPhrase.get(currentPhrase).length;
})

export const cards = derived(cardsByPhrase, cardsByPhrase => {
	return Array.from(cardsByPhrase.values()).flat();
});
export const cardCount = derived(cards, cards => cards.length);
export const usedPhrases = derived(cards, cards => {
	//can't just do `return Array.from(cardsByPhrase.keys())` because it would include any
	const phraseSet = new Set();
	cards.forEach(({context}) => phraseSet.add(context));
	return Array.from(phraseSet);
})

//subscribe to all stores so they can be used internally without `get()`
const cached = new Map();
[
	cardsByPhrase,
	currentPhraseIndex,
	currentPhrase,
	currentPhraseCardCount,
	cards,
	cardCount,
	usedPhrases
].forEach(store => {
	store.subscribe(val => {
		cached.set(store, val);
	})
})
