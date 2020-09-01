<picture>
	<source srcset={asset(`${src}.webp`)} type="image/webp" />
	<img src={asset(`${src}.png`)} {alt} />
</picture>
<script>
	import {asset} from './assets';
	export let src;
	export let alt;
</script>