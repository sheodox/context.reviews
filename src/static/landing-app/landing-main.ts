/// <reference types="vite/client" />
/// <reference types="svelte" />
import '../assets/stylesheets/style.scss';
import '../assets/stylesheets/landing.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { styles } from 'sheodox-ui';
import LandingApp from './LandingApp.svelte';

new LandingApp({
	target: document.getElementById('app-root'),
});
