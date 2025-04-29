<script lang="ts">
	import Fetch from "$lib/components/FetchShows.svelte";
</script>

<div class="container">
	<div class="main">
		<Fetch />
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
