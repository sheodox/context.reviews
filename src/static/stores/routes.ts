import { writable } from 'svelte/store';
import page from 'page';

interface RouteOptions {
	noScroll?: boolean;
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
page(`/export`, setRoute('export'));
page(`/help`, setRoute('help'));
page(`/`, setRoute('list', { noScroll: true }));
page();
