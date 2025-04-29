<script lang="ts">
	import { onMount } from "svelte";
	let scrolled = false;

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY >= window.innerHeight / 2;
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<button
	class="scroll-to-top-btn {scrolled ? 'visible' : ''}"
	on:click={scrollToTop}
>
	<div class="arrow"></div>
	Back to top
</button>

<style lang="scss">
	.scroll-to-top-btn {
		position: fixed;
		bottom: 10px;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: 50px;
		width: fit-content;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10px;
		border: none;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background-color: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		color: rgb(194, 194, 194);
		font-weight: 300;
		cursor: pointer;
		z-index: 3;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
		transition: 0.2s ease;

		transform: translateY(95%) scale(0.3);
		opacity: 0;
		pointer-events: none;
		&.visible {
			transform: translateY(0) scale(1);
			opacity: 1;
			pointer-events: auto;
		}
		&:hover {
			padding: 20px;
			background-color: rgb(29, 27, 35);
			color: rgb(146, 138, 222);
			.arrow {
				border: solid rgb(146, 138, 222);
				border-width: 0 2px 2px 0;
			}
		}
	}

	.arrow {
		border: solid rgb(194, 194, 194);
		border-width: 0 2px 2px 0;
		width: 8px;
		height: 8px;
		rotate: -135deg;
		margin: 3px 10px 0 0px;
	}

	@media (max-width: 768px) {
		.scroll-to-top-btn {
			bottom: 85px;
			-webkit-touch-callout: none;
			user-select: none;
			-webkit-user-select: none;
			&:active {
				background-color: rgb(29, 27, 35);
			}
		}
	}
</style>
