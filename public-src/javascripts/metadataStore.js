import {writable} from 'svelte/store';

export const user = writable(window.userMetadata.user);

export const settings = writable(window.userMetadata.user.settings);

export const hasAddedPhrases = writable(window.userMetadata.usage.hasAddedPhrases);

settings.subscribe(async settings => {
	await fetch('/user/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	})
})