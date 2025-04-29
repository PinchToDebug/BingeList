<script lang="ts">
</script>

<nav class="menu-bar"><slot></slot></nav>

<style lang="scss">
	.menu-bar {
		top: 0;
		height: 60px;
		display: flex;
		position: fixed;
		align-items: center;
		color: rgb(211, 211, 211);
		border-bottom: 1px solid #80808031;
		left: 0;
		right: 0;
		box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.75);
		margin: 0 auto;
		padding: 0px;
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	@media (max-width: 768px) {
		.menu-bar {
			height: 70px;
			top: auto;
			bottom: 0;
			border-top: 1.3px solid #80808031;
			border-bottom: none;
		}
	}
</style>
