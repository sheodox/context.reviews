<style>
</style>

<Header slim={false}>
    <LoginButton />
</Header>

<main class="f-column align-items-center">
    <Pitch />
</main>

<Footer signedIn={false} />

<script>
	import Header from '../Header.svelte';
	import Pitch from './Pitch.svelte';
	import LoginButton from "./LoginButton.svelte";
	import Footer from '../Footer.svelte';
</script>