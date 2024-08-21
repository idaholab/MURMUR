<script lang="ts">
    import { onMount } from 'svelte';
	import { theme } from '@stores/style';

    onMount(async () => {
		$theme = 'dark';
	});
</script>