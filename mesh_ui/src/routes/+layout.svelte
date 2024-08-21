<script lang="ts">
	import { theme } from '@stores/style';

	import TopBar from '@lib/TopBar.svelte';
	import MeshForm from '@lib/MeshForm.svelte';
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme == '' ? 'light dark' : $theme} />
	<link rel="stylesheet" href={`/smui-${$theme}.css`} />
</svelte:head>

<TopBar />

<div class="slot">
	<slot />
</div>

<style>
	.slot {
		padding: 6rem 2rem 2rem 2rem;
	}
</style>
