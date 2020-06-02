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

const socket = io({
	pathname: location.pathname + 'socket.io/socket.io',
	reconnectionAttempts: 1
});
let useXHR = false;

socket.on('refresh', list => {
	phraseStore.set(list);
});
socket.on('connect_error', () => {
	if (useXHR) {
		return;
	}

	useXHR = true;
	setInterval(() => {
		action('list');
	}, 10 * 1000);
});

action('list');
