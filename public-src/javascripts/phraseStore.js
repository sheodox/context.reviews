import {writable} from 'svelte/store';
import {connectSocket} from './client-socket';
import {hasAddedPhrases} from "./metadataStore";
import {createAutoExpireToast} from "sheodox-ui/components/toast";

const phraseStore = writable(null);

async function action(url) {
	await fetch(`/phrases/${url}`)
}

async function remove(ids) {
	await fetch(`/phrases/remove`, {
		method: 'POST',
		body: JSON.stringify(ids),
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

export default {
	subscribe: phraseStore.subscribe,
	action,
	remove
}

connectSocket(({send, on}) => {
	on('list', phrases => {
		phraseStore.set(phrases);
		if (phrases.length) {
			//if this is their first time using the site and have added phrases
			//we don't want to show them the first time Help on the list after
			//exporting or deleting them. consider them a regular user now
			hasAddedPhrases.set(true);
		}
	})

	//request the list, necessary initially, and possibly necessary
	//if the internet was interrupted for a while and the list changed
	send('list');
})

let lastPhrases = null;
phraseStore.subscribe(phrases => {
	//haven't requested phrases yet, wait
	if (phrases === null) {
		return;
	}

	//init, nothing to notify of here, don't want to notify them of the entire list
	if (!lastPhrases) {
		lastPhrases = phrases;
		return;
	}

	const newPhrases = phrases.filter(({phrase}) => {
		return !lastPhrases.some(lastPhrase => {
			return lastPhrase.phrase === phrase;
		})
	})

	if (newPhrases.length > 3) {
		createAutoExpireToast({
			title: 'Added Phrases',
			message: `${newPhrases.length} phrases were added.`
		})
	}
	else if (newPhrases.length) {
		newPhrases.forEach(phrase => {
			createAutoExpireToast({
				title: `Added Phrase`,
				message: phrase.phrase
			});
		});
	}

	lastPhrases = phrases;
})
