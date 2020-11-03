<Header appName="Context.Reviews" {pageName} {slim}>
	<div slot="logo"><Image src="favicon" /></div>
	<slot slot="nav" />
</Header>
<script>
	import {asset} from './assets';
	import Image from "./Image.svelte";
	import {Header} from 'sheodox-ui';

	export let pageName;
	//slim=true is smaller and fits as part of the list/export apps
	//slim=false is bigger with no background, used prominently on the landing page
	export let slim = true;
</script>