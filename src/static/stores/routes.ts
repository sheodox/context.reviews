import { writable } from 'svelte/store';
import page from 'page';

interface RouteOptions {
	// if the app should be treated 100vh max height
	noScroll?: boolean;
	// if the app should have overflow-y: scroll
	alwaysScroll?: boolean;
}

export const activeRoute = writable<string>('');
export const activeRouteOptions = writable<RouteOptions>({});

function setRoute(route: string, options: RouteOptions = {}) {
	return () => {
		activeRoute.set(route);
		activeRouteOptions.set(options);
	};
}

page(`/settings`, setRoute('settings'));
page(`/about`, setRoute('about'));
// when definitions are shown/hidden there's a good chance the scroll bar
// will be showing half of the time causing the page to jump back and forth
// a few pixels every time, keeping the scrollbar there makes it less jittery
page(`/export`, setRoute('export', { alwaysScroll: true }));
page(`/help`, setRoute('help'));
page(`/import`, setRoute('import'));
page(`/import/subtitles`, setRoute('import/subtitles'));
page(`/import/plain`, setRoute('import/plain'));
page(`/`, setRoute('list', { noScroll: true }));
page();
