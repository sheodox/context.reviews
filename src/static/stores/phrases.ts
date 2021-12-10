import { writable } from 'svelte/store';
import { connectSocket } from '../client-socket';
import { hasAddedPhrases } from './metadata';
import { createAutoExpireToast } from 'sheodox-ui';
import { createHttpErrorToast, statusMessageMap } from '../http-error-toasts';
import type { Phrase } from '../../shared/types/phrases';

const initialPhrases = (window as any).__APP_BOOTSTRAP__.initialState.phrases;
const phraseStore = writable<Phrase[]>(initialPhrases);
async function handleActionResponse(res: Response) {
	if (res.ok) {
		return;
	}

	const { message } = statusMessageMap.get(res.status) || {
		message: 'An unknown error occurred.',
	};
	await createHttpErrorToast(message, res);
}

async function action(url: string) {
	await fetch(`/phrases/${url}`).then(handleActionResponse);
}

async function remove(ids: string[]) {
	await fetch(`/phrases/remove`, {
		method: 'POST',
		body: JSON.stringify(ids),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(handleActionResponse);
}

export default {
	subscribe: phraseStore.subscribe,
	action,
	remove,
};

connectSocket(({ send, on }) => {
	on('list', (phrases) => {
		phraseStore.set(phrases);
		if (phrases.length) {
			//if this is their first time using the site and have added phrases
			//we don't want to show them the first time Help on the list after
			//exporting or deleting them. consider them a regular user now
			hasAddedPhrases.set(true);
		}
	});

	//request the list, necessary initially, and possibly necessary
	//if the internet was interrupted for a while and the list changed
	send('list');
});

let lastPhrases: Phrase[] = null;
phraseStore.subscribe((phrases) => {
	//haven't requested phrases yet, wait
	if (phrases === null) {
		return;
	}

	//init, nothing to notify of here, don't want to notify them of the entire list
	if (!lastPhrases) {
		lastPhrases = phrases;
		return;
	}

	const newPhrases = phrases.filter(({ id }) => {
		return !lastPhrases.some((lastPhrase) => {
			return lastPhrase.id === id;
		});
	});

	if (newPhrases.length > 3) {
		createAutoExpireToast({
			title: 'Added Phrases',
			message: `${newPhrases.length} phrases were added.`,
		});
	} else if (newPhrases.length) {
		newPhrases.forEach((phrase) => {
			createAutoExpireToast({
				title: `Added Phrase`,
				message: phrase.phrase,
			});
		});
	}

	lastPhrases = phrases;
});
