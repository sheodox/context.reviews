<Header appName="Context.Reviews" slim={false}>
	<div slot="logo"><Image src="favicon" pictureClasses="f-row align-items-center" alt="logo" /></div>
</Header>

<main class="f-column align-items-center">
	<Pitch />
</main>

<Footer />

<script lang="ts">
	import { Header } from 'sheodox-ui';
	import Image from '../Image.svelte';
	import Pitch from './Pitch.svelte';
	import Footer from '../Footer.svelte';
</script>
