/// <reference types="vite/client" />
/// <reference types="svelte" />
import App from './App.svelte';
import './assets/stylesheets/style.scss';
import './assets/stylesheets/list.scss';

new App({
	target: document.querySelector('#app-root'),
});
