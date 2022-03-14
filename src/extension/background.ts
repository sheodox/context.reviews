import { getSetting, settingNames } from './extension-utils';
import browser from 'webextension-polyfill';

const handlers: Record<string, any> = {
		addPhrase,
		listPhrases,
		removePhrase,
		changeActivePhrasesBadge,
	},
	ACTIVE_PHRASE_POLL_MS = 1000 * 60 * 60 * 2; //two hours

interface BackgroundMessage {
	handler: string;
	data: any;
}

browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
	const { handler, data } = message;

	if (handlers[handler]) {
		return handlers[handler](data);
	}

	return false;
});

function addPhrase(phrase: string) {
	console.log(`adding phrase`, phrase);
	return request(`--server--/phrases/add/${encodeURIComponent(phrase)}?extension=1`);
}

function listPhrases() {
	console.log(`listing phrases`);
	return request(`--server--/phrases/list?extension=1`);
}

function removePhrase(phraseId: string) {
	console.log(`removing phrase`, phraseId);
	return request(`--server--/phrases/remove/${encodeURIComponent(phraseId)}?extension=1`);
}

async function request(url: string) {
	try {
		const res = await fetch(url);

		return {
			status: res.status,
			response: res.status === 200 ? await res.json() : null,
		};
	} catch (e) {
		return {
			status: 0,
			response: null,
		};
	}
}

function setBadge(text: string, color = '#05070b') {
	const action = browser.browserAction || browser.action;
	action.setBadgeText({
		text: '' + text,
	});
	action.setBadgeBackgroundColor({
		color,
	});
}

async function updateActivePhrases() {
	const { status, response } = await request(`--server--/user/stats?extension=1`);
	if (status === 200) {
		setBadge(response.activePhrases);
	} else {
		setBadge('?', '#e83450');
	}
}

let activePhrasesPollInterval: ReturnType<typeof setInterval>;
function startActivePhrasePolling() {
	clearInterval(activePhrasesPollInterval); //insurance, don't know if we could double up

	activePhrasesPollInterval = setInterval(() => {
		updateActivePhrases();
	}, ACTIVE_PHRASE_POLL_MS);
}

async function changeActivePhrasesBadge() {
	const isActive = await getSetting(settingNames.showActivePhrasesBadge);
	if (isActive) {
		//update immediately, then schedule to poll occasionally
		updateActivePhrases();
		startActivePhrasePolling();
	} else {
		clearTimeout(activePhrasesPollInterval);

		const action = browser.browserAction || browser.action;
		action.setBadgeText({
			text: '',
		});
	}
}

// Watch for requests to phrase actions, if something is caught here it means
// there's a decent chance the phrase list was changed (either on the site
// or through the extension) and we need to update the badge. Note that
// the count is retrieved from /user/stats so it doesn't get caught here
// and start an infinite loop!
browser.webRequest.onCompleted.addListener(
	async () => {
		const isActive = await getSetting(settingNames.showActivePhrasesBadge);
		if (isActive) {
			await updateActivePhrases();
		}
	},
	{
		urls: [
			//watch for when the websocket connects (this is only on the website)
			//it can indicate that the user has successfully logged in without
			//having to watch for page navigation (can't just check for /auth/*
			//patterns here, it won't get triggered from webRequest)
			'--server-websocket--/*',
			//watch for phrase changes
			'--server--/phrases/*',
		],
	}
);

//on boot, check if we need to start polling
changeActivePhrasesBadge();
