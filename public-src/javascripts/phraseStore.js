import {writable} from 'svelte/store';

const phraseStore = writable(null);

async function action(url) {
	const phrases = await fetch(`/phrases/${url}`)
		.then(res => res.json());

	phraseStore.set(phrases);
}

async function remove(ids) {
	const phrases = await fetch(`/phrases/remove`, {
		method: 'POST',
		body: JSON.stringify(ids),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => res.json())

	phraseStore.set(phrases);
}

export default {
	subscribe: phraseStore.subscribe,
	action,
	remove
}

setInterval(() => {
	action('list');
}, 10 * 1000);
action('list');
