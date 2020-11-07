<style>
</style>

<Header slim={false} loggedIn={false}>
    <LoginButton />
</Header>

<main class="f-column align-items-center">
    <Pitch />
</main>

<Footer />

<script>
	import Header from '../Header.svelte';
	import Pitch from './Pitch.svelte';
	import LoginButton from "./LoginButton.svelte";
	import Footer from '../Footer.svelte';
</script>