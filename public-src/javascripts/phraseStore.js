import {writable} from 'svelte/store';
import {connectSocket} from './client-socket';

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
	})

	//request the list, necessary initially, and possibly necessary
	//if the internet was interrupted for a while and the list changed
	send('list');
})
