/// <reference types="vite/client" />
/// <reference types="svelte" />
import App from './ExportApp.svelte';
import '../assets/stylesheets/style.scss';
import '../assets/stylesheets/export.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { styles } from 'sheodox-ui';

new App({
	target: document.querySelector('#app-root'),
});
