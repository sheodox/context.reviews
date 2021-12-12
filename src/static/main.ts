/// <reference types="vite/client" />
/// <reference types="svelte" />
import App from './App.svelte';
import './assets/stylesheets/style.scss';
import './assets/stylesheets/list.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { styles } from 'sheodox-ui';

new App({
	target: document.querySelector('#app-root'),
});
