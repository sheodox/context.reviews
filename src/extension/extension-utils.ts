import { addPhrase, showErrorMessage } from './stasher/stasher-stores';
import { splitIntoPhrases } from '../shared/phrase-utils';
import browser from 'webextension-polyfill';

export const COULDNT_CONNECT_ERROR = `Couldn't connect to Context.Reviews. Is the site down?`;

export interface Phrase {
	phrase: string;
	phrase_id: null | string;
	status: 'added' | 'deleted' | 'prompt';
}

const errorsByStatus: Record<string, string> = {
	0: COULDNT_CONNECT_ERROR,
	401: `You aren't signed into Context.Reviews!`,
};

export function getResourceUrl(url: string) {
	return browser.runtime.getURL(url);
}

export async function messageBackground<T>(handler: string, data?: any) {
	const message = {
		handler,
		data,
	};

	const { status, response } = (await browser.runtime.sendMessage(message)) || { status: 200, response: null };

	if (status !== 200) {
		const error = errorsByStatus[status];
		showErrorMessage(error || `Error: status code ${status}`);
	}

	return { status, ok: status === 200, response: response as T };
}

export function addCouldntConnectToast() {
	showErrorMessage(COULDNT_CONNECT_ERROR);
}

// for IDE auto-complete and less magic strings when accessing settings!
export const settingNames = {
	recordingMode: 'recordingMode',
	toastPosition: 'toastPosition',
	initiallyHideToasts: 'initiallyHideToasts',
	showActivePhrasesBadge: 'showActivePhraseBadge',
	autoHide: 'autoHide',
};

const settingDefaults = {
	// if/when phrases should be saved to context.reviews
	[settingNames.recordingMode]: 'always',
	// the side of the screen that the toasts should be mounted on
	[settingNames.toastPosition]: 'right',
	// if toasts should be hidden as if expired when they're added
	[settingNames.initiallyHideToasts]: false,
	// show the number of active phrases on the extension badge
	[settingNames.showActivePhrasesBadge]: true,
	[settingNames.autoHide]: true,
};

export async function getSetting<T>(key: string) {
	const setting = await new Promise((resolve) => {
		//chrome expects a callback, firefox returns a promise, resolve if we get
		//a promise (otherwise fallback to a promise that'll never resolve),
		//or pass a callback if necessary
		browser.storage.sync.get(key).then(resolve);
	});

	return typeof setting[key as keyof typeof setting] === 'undefined'
		? (settingDefaults[key] as unknown as T)
		: (setting[key as keyof typeof setting] as T);
}

export function setSetting(key: string, value: any) {
	return browser.storage.sync.set({
		[key]: value,
	});
}

function getSearchTerms() {
	return (document.querySelector('#keyword') as HTMLInputElement).value;
}

export async function promptRecord() {
	const searchPhrases = splitIntoPhrases(getSearchTerms()),
		{ response, ok } = await messageBackground<Phrase[]>('listPhrases');

	if (!ok) {
		return;
	}

	searchPhrases.forEach((phrase) => {
		const existing = response.find((p) => p.phrase === phrase);

		addPhrase({
			phrase_id: existing?.phrase_id || null,
			phrase,
			status: existing ? 'added' : 'prompt',
		});
	});
}

interface RecordResponse {
	addedPhrases: Phrase[];
	existingPhrases: Phrase[];
	stats: {
		totalPhrases: number;
	};
}

export async function record(word?: string | string[]) {
	const phrase = word || getSearchTerms(),
		{ response, ok } = await messageBackground<RecordResponse>('addPhrase', phrase);

	if (ok) {
		//if nothing was actually added, don't show any toasts
		[...response.addedPhrases, ...response.existingPhrases].forEach((addedPhrase) => {
			addPhrase({ ...addedPhrase, status: 'added' });
		});
	}
}

export async function remove(phrase: Phrase) {
	await messageBackground('removePhrase', phrase.phrase_id);

	// update the status in place
	addPhrase({ ...phrase, status: 'deleted' });
}
