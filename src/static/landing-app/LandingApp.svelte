<Header appName="Context.Reviews" slim={false}>
	<div slot="logo"><Image src="favicon" pictureClasses="f-row align-items-center" alt="logo" /></div>
</Header>

<main class="f-column align-items-center">
	<Pitch />
</main>

<Footer />
<SheodoxUIStyles />

<script lang="ts">
	import { Header, SheodoxUIStyles } from 'sheodox-ui';
	import Image from '../Image.svelte';
	import Pitch from './Pitch.svelte';
	import Footer from '../Footer.svelte';
</script>
