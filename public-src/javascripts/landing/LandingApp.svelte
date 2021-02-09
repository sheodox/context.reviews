<Header appName="Context.Reviews" slim={false} loggedIn={false}>
    <div slot="logo"><Image src="favicon" pictureClasses="f-row align-items-center"/></div>
    <div slot="nav">
        <LoginButton />
    </div>
</Header>

<main class="f-column align-items-center">
    <Pitch />
</main>

<Footer />

<script>
	import {Header} from 'sheodox-ui';
    import Image from "../Image.svelte";
	import Pitch from './Pitch.svelte';
	import LoginButton from "./LoginButton.svelte";
	import Footer from '../Footer.svelte';
</script>