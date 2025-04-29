<script lang="ts">
	let { rating }: { rating: number } = $props();
</script>

<div
	class="bar"
	style="background: linear-gradient(
	    to right,
	    rgb(88, 192, 88) {rating * 10}%,
	     rgba(127, 127, 127, 0.3) {rating * 10}%,
	     rgba(127, 127, 127, 0.3) 100%
	   );"
></div>

<style lang="scss">
	.bar {
		margin-top: -4px;
		height: 10px;
		border-radius: 3px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
		background-color: rgba(127, 127, 127, 0.3);
	}
</style>
