import { createAutoExpireToast } from 'sheodox-ui';
import { get, writable, derived } from 'svelte/store';
import SRSConstructor from '../export-app/SRSConstructor';
import { cards } from './cards';

type AnkiDecks = { id: number; name: string }[];

export const ankiDecks = writable<AnkiDecks>([], () => {
	fetchDecks();
});

type AnkiConnectStatus = 'available' | 'unavailable';

export const ankiConnectStatus = writable<AnkiConnectStatus>(null, () => {
	const interval = setInterval(() => {
		fetchDecks();
	}, 2000);

	return () => clearInterval(interval);
});
export const selectedAnkiDeck = writable<number>(null);
const selectedAnkiDeckName = derived([ankiDecks, selectedAnkiDeck], ([decks, selectedId]) => {
	return decks.find((deck) => deck.id === selectedId).name;
});

async function acAction<T>(
	action: string,
	params: any = {}
): Promise<{ status: number; result: T | null; error: string | null }> {
	const req = fetch('http://localhost:8765', {
		method: 'POST',
		body: JSON.stringify({
			action,
			params,
			version: 6,
		}),
	});

	try {
		await req;
	} catch (e) {
		// Anki-Connect is unreachable, either offline or permission hasn't been granted
		return { status: 0, result: null, error: 'Anki-Connect could not be reached.' };
	}

	const res = await req,
		data = res.status === 200 ? await res.json() : null;
	return {
		status: res.status,
		result: data ? data.result : null,
		error: data ? data.error : null,
	};
}

async function fetchDecks() {
	const { status, result } = await acAction<Record<string, number>>('deckNamesAndIds');

	if (status === 0) {
		ankiConnectStatus.set('unavailable');
	} else {
		ankiConnectStatus.set('available');
		const decks = [];
		for (const deckName of Object.keys(result)) {
			decks.push({
				id: result[deckName],
				name: deckName,
			});
		}
		ankiDecks.set(decks);
	}
}

export async function newDeck() {
	const deckName = prompt('Enter a new deck name')?.trim();
	if (deckName) {
		const { result } = await acAction<number>('createDeck', { deck: deckName });
		await fetchDecks();
		// select the newly created deck
		selectedAnkiDeck.set(result);
	}
}

export async function requestPermission() {
	const checkAnkiTimeout = setTimeout(() => {
			createAutoExpireToast({
				title: 'Anki-Connect Permissions',
				message: 'Check Anki to allow Context.Reviews to use Anki-Connect',
			});
		}, 100),
		{ result, error } = await acAction<{ permission: 'granted' | 'denied' }>('requestPermission');

	clearTimeout(checkAnkiTimeout);

	if (error) {
		createAutoExpireToast({
			variant: 'error',
			title: 'Error',
			message: 'Error requesting permission from Anki-Connect.',
			technicalDetails: error,
		});
		return { error };
	}

	if (result?.permission === 'granted') {
		await fetchDecks();
		ankiConnectStatus.set('available');
	}

	return { error, result };
}

async function ensureCardModel(cardModelName: string, modelDefinition: any) {
	const { result, error } = await acAction<string[]>('modelNames');
	if (error) {
		return { error };
	}

	if (result.includes(cardModelName)) {
		return { error: null };
	}

	return await acAction('createModel', modelDefinition);
}

export async function importCards() {
	const srs = new SRSConstructor();

	// if we can't make the card model don't proceed. the calling component will alert with any errors returned from this function
	const { error } = await ensureCardModel(srs.getCardModelName(), srs.getCardModelDefinition());
	if (error) {
		return { error };
	}

	srs.addCards(get(cards));
	return await acAction('addNotes', {
		notes: srs.exportAnkiConnect(get(selectedAnkiDeckName)),
	});
}
