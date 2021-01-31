import {writable} from 'svelte/store';

export const user = writable(window.userMetadata.user);

export const settings = writable(window.userMetadata.user.settings);

export const hasAddedPhrases = writable(window.userMetadata.usage.hasAddedPhrases);

let settingsSubscriptionCalled = false;
settings.subscribe(async settings => {
	//ignore the store initialization or we'll always save settings as soon as the page loads
	if (!settingsSubscriptionCalled) {
		settingsSubscriptionCalled = true;
		return;
	}

	await fetch('/user/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	})
})