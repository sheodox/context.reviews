import {writable} from 'svelte/store';

const phraseStore = writable(null);

async function action(url) {
	const phrases = await fetch(`/phrases/${url}`)
		.then(res => res.json());

	phraseStore.set(phrases);
}

export default {
	subscribe: phraseStore.subscribe,
	action
}

setInterval(() => {
	action('list');
}, 10 * 1000);
action('list');
