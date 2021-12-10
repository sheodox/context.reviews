<picture class={pictureClasses}>
	<source srcset={asset(`${src}.webp`)} type="image/webp" />
	<img src={asset(`${src}.png`)} {alt} />
</picture>

<script lang="ts">
	import { asset } from './assets';
	export let src: string;
	export let alt: string;
	export let pictureClasses = '';
</script>
