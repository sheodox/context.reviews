import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';

export const register = new Registry();

const name = (name: string) => `contextreviews_${name}`;

//phrases
export const phrasesTotal = new Counter({
	name: name('phrases_total'),
	help: 'Total number of phrases that have been added',
});

export const phrasesActive = new Gauge({
	name: name('phrases_active'),
	help: `Total number of phrases that have been added and aren't active`,
});

export const phrasesAdded = new Counter({
	name: name('phrases_added'),
	help: 'Number of phrases added',
});

export const phrasesRemoved = new Counter({
	name: name('phrases_removed'),
	help: 'Number of phrases removed',
});

export const phrasesUndone = new Counter({
	name: name('phrases_undone'),
	help: 'Number of phrase deletions that were undone',
});

export const phrasesListTime = new Histogram({
	name: name('phrase_list_time'),
	help: `Time to query for a user's phrase list`,
});

export const phrasesAddTime = new Histogram({
	name: name('phrase_add_time'),
	help: `Time to add a phrase`,
});

export const phrasesRemoveTime = new Histogram({
	name: name('phrase_remove_time'),
	help: `Time to query for a user's phrase list`,
});

export const phrasesUndoTime = new Histogram({
	name: name('phrase_undo_time'),
	help: `Time to query for a user's phrase list`,
});

//lookups
export const lookups = new Counter({
	name: name('lookups'),
	help: 'Number of Jisho lookups',
});

export const lookupsCacheHit = new Counter({
	name: name('lookups_cache_hits'),
	help: 'Number of Jisho lookup cache hits in Redis',
});

export const lookupsNoResults = new Counter({
	name: name('lookups_no_results'),
	help: 'Number of Jisho lookups that had no results',
});

export const lookupTime = new Histogram({
	name: name('lookups_time'),
	help: 'Time to perform a Jisho API call lookup',
});

//users
export const usersTotal = new Counter({
	name: name('users_total'),
	help: 'Total number of users that exist',
});

export const usersLoggedIn = new Counter({
	name: name('users_logged_in'),
	help: 'Number of users who logged in',
});

export const usersNew = new Counter({
	name: name('users_new'),
	help: 'Number of users who signed in for the first time',
});

//page hits
export const landingServed = new Counter({
	name: name('landing_served'),
	help: `Number of times the landing page was served to clients that aren't logged in`,
});
export const appServed = new Counter({
	name: name('app_served'),
	help: `Number of times the app was served`,
});
export const privacyServed = new Counter({
	name: name('privacy_served'),
	help: `Number of times the privacy policy page was served`,
});
export const notFoundServed = new Counter({
	name: name('404_served'),
	help: `Number of times a 404 error was encountered`,
});

//misc
export const logsCollected = new Counter({
	name: name('logs_collected'),
	help: `Number of messages that have been logged and collected by remote log aggregation tools.`,
});

export const connectedWebsockets = new Gauge({
	name: name('connected_websockets'),
	help: 'The number of currently connected websockets.',
});

export const connectedUsers = new Gauge({
	name: name('connected_users'),
	help: 'The number of users who currently have connected websockets.',
});

[
	phrasesAdded,
	phrasesActive,
	phrasesRemoved,
	phrasesUndone,
	phrasesListTime,
	phrasesAddTime,
	phrasesRemoveTime,
	phrasesUndoTime,
	phrasesTotal,

	lookups,
	lookupsCacheHit,
	lookupsNoResults,
	lookupTime,

	usersLoggedIn,
	usersNew,
	usersTotal,

	landingServed,
	appServed,
	privacyServed,
	notFoundServed,

	logsCollected,
	connectedWebsockets,
	connectedUsers,
].forEach((metric) => register.registerMetric(metric));

collectDefaultMetrics({ register });
