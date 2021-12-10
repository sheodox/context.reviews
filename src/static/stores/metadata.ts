import { writable } from 'svelte/store';

const appBootstrap = (window as any).__APP_BOOTSTRAP__;

export const user = writable(appBootstrap.user);

export const settings = writable(appBootstrap.user.settings);

export const hasAddedPhrases = writable(appBootstrap.usage.hasAddedPhrases);

let settingsSubscriptionCalled = false;
settings.subscribe(async (settings) => {
	//ignore the store initialization or we'll always save settings as soon as the page loads
	if (!settingsSubscriptionCalled) {
		settingsSubscriptionCalled = true;
		return;
	}

	await fetch('/user/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(settings),
	});
});
