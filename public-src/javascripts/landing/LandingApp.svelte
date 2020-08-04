<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>

<Header>
    <LoginButton />
</Header>

<main>
    <Pitch />
</main>

<Footer signedIn={false} />

<script>
	import Header from '../Header.svelte';
	import GetStarted from './GetStarted.svelte';
	import Pitch from './Pitch.svelte';
	import LoginButton from "./LoginButton.svelte";
	import Footer from '../Footer.svelte';
</script>