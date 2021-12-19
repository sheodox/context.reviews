<style>
	#app {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	main {
		overflow: auto;
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	@media (min-width: 650px) {
		/* on mobile breakpoints keeping the whole app in the page makes the footer obnoxiously large */
		.no-scroll {
			max-height: 100vh;
		}
	}
	@media (max-width: 650px) {
		main {
			min-height: 80vh;
			scroll-snap-type: x mandatory;
		}
	}
</style>

<div id="app" class:no-scroll={$activeRouteOptions.noScroll}>
	<AppHeader />
	<main>
		<Router />
	</main>

	<Footer />
</div>

<Toasts dockedAt="bottom-center" />

<script lang="ts">
	import { Toasts } from 'sheodox-ui';
	import Router from './Router.svelte';
	import Footer from './Footer.svelte';
	import AppHeader from './AppHeader.svelte';
	import { activeRouteOptions } from './stores/routes';

	$: document.body.style.overflowY = $activeRouteOptions.alwaysScroll ? 'scroll' : '';
</script>
