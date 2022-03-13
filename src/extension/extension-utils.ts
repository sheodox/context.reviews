import { addToast } from './stasher/toast-stores';
import browser from 'webextension-polyfill';

export const COULDNT_CONNECT_ERROR = `Couldn't connect to Context.Reviews. Is the site down?`;

export function getResourceUrl(url: string) {
	return browser.runtime.getURL(url);
}

export function messageBackground(handler: string, data?: any) {
	const message = {
		handler,
		data,
	};

	return browser.runtime.sendMessage(message);
}

export function addCouldntConnectToast() {
	addToast({
		type: 'error',
		text: COULDNT_CONNECT_ERROR,
	});
}

// for IDE auto-complete and less magic strings when accessing settings!
export const settingNames = {
	recordingMode: 'recordingMode',
	toastPosition: 'toastPosition',
	initiallyHideToasts: 'initiallyHideToasts',
	toastAnimations: 'toastAnimations',
	showActivePhrasesBadge: 'showActivePhraseBadge',
};

const settingDefaults = {
	// if/when phrases should be saved to context.reviews
	[settingNames.recordingMode]: 'always',
	// the side of the screen that the toasts should be mounted on
	[settingNames.toastPosition]: 'right',
	// if toasts should be hidden as if expired when they're added
	[settingNames.initiallyHideToasts]: false,
	// if toasts show the animated purple bar for how much time until they're hidden
	[settingNames.toastAnimations]: true,
	// show the number of active phrases on the extension badge
	[settingNames.showActivePhrasesBadge]: true,
};

export async function getSetting<T>(key: string) {
	const setting = await new Promise(async (resolve) => {
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

const errorsByStatus: Record<string, string> = {
	0: COULDNT_CONNECT_ERROR,
	401: `You aren't signed in!`,
};

export async function record(word: string) {
	const phrase = word || (document.querySelector('#keyword') as HTMLInputElement).value,
		{ status, response } = await messageBackground('addPhrase', phrase);

	if (status === 200) {
		const numNew = response.addedPhrases.length,
			numExisting = response.existingPhrases.length,
			totalText = `(${response.stats.totalPhrases} total)`;

		//if nothing was actually added, don't show any toasts
		if (numNew > 0) {
			addToast({
				type: 'success',
				text: `${numNew} phrase${numNew === 1 ? '' : 's'} added ${totalText}`,
				phrases: response.addedPhrases,
			});
		}

		//if they're looking at a search for a phrase that already has been saved
		//show a toast so they don't have to go searching for it in the list
		if (numExisting > 0) {
			addToast({
				type: 'success',
				text: `${numExisting} phrase${numExisting === 1 ? ' was' : 's were'} already saved ${totalText}`,
				phrases: response.existingPhrases,
			});
		}
		return;
	}

	const error = errorsByStatus[status];

	addToast({
		type: 'error',
		text: error || `Error: status code ${status}`,
	});
}
