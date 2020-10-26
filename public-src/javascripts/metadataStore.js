import {writable} from 'svelte/store';

export const user = writable(window.userMetadata.user);

export const hasAddedPhrases = writable(window.userMetadata.usage.hasAddedPhrases);