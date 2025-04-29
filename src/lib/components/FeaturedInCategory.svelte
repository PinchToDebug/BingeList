<script lang="ts">
	import { onMount } from "svelte";
	import { dragscroll } from "@svelte-put/dragscroll";
	import Card from "./ContentCard.svelte";
	import checkToken from "$lib/utility/checkToken";

	export let datas: any[];
	export let category: string;
	export let showPopup: boolean;
	export let popupData: any;
	let token = "";
	let inList = false;
	let scrollEl: HTMLDivElement;
	let userShowList: number[] = [];
	const fetchUserWatchListIDs = async () => {
		if (!token) return;

		const res = await fetch("/api/v1/user/list", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const data = await res.json();
			if (Array.isArray(data.shows)) {
				userShowList = [];
				data.shows.forEach((show: { id: number }) => {
					userShowList.push(show.id);
				});
			}
		} else {
			console.error("Fetch failed:", await res.text());
		}
	};
	onMount(async () => {
		const res = await fetch("/");
		token = await res.text();
		if (token !== "" && (await checkToken(token))) {
			fetchUserWatchListIDs();
		}
	});
	function scroll(offsetMultiplier: number) {
		const offset = scrollEl.clientWidth * offsetMultiplier;
		scrollEl.scrollBy({ left: offset, behavior: "smooth" });
	}
</script>

<p>{category}</p>

<div class="scroll-container">
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button class="scroll-btn left" on:click={() => scroll(-0.8)}>
		<div class="arrow"></div>
	</button>
	<div class="card-wrapper" use:dragscroll bind:this={scrollEl}>
		<div class="wd"></div>
		{#each datas as show}
			{#if show.show_data.genres.includes(category)}
				<Card
					data={show}
					inList={userShowList.includes(show.show_data.id)}
					bind:popupData
					bind:showDetails={showPopup}
				/>
			{/if}
		{/each}
		<div class="wd"></div>
	</div>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button class="scroll-btn right" on:click={() => scroll(0.8)}>
		<div class="arrow"></div>
	</button>
</div>

<style lang="scss">
	.wd {
		min-width: 30px;
	}
	.card-wrapper {
		position: relative;
		display: flex;
		overflow-x: auto;
		scroll-behavior: auto;
		scrollbar-width: none;
		cursor: default !important;

		gap: 10px;
		padding-bottom: 20px;
		&::-webkit-scrollbar {
			display: none;
		}
		mask-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0) 10px,
			rgba(0, 0, 0, 1) 5%,
			rgba(0, 0, 0, 1) 95%,
			rgba(0, 0, 0, 0) 98%
		);
		-webkit-mask-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0) 5px,
			rgba(0, 0, 0, 1) 30px,
			rgba(0, 0, 0, 1) calc(100% - 30px),
			rgba(0, 0, 0, 0) calc(100% - 5px)
		);
	}
	.scroll-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.scroll-btn {
		position: absolute;
		top: 119.39px;
		transform: translateY(-50%);

		cursor: pointer;
		-webkit-touch-callout: none;
		user-select: none;
		-webkit-user-select: none;
		height: 40px;
		width: 40px;
		border-radius: 50%;
		font-size: 18px;
		display: flex;
		margin: 0 auto;
		padding: 0px;
		z-index: 2;
		border: 1.3px solid #80808031;

		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.75);
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		align-items: center;
		justify-content: center;
		padding: 0;

		&.left {
			left: 20px;
			padding-left: 4px;
		}

		&.right {
			right: 20px;
			padding-right: 4px;
		}
		.arrow {
			border: solid white;
			border-width: 0 2px 2px 0;
			width: 8px;
			height: 8px;
		}

		&.left .arrow {
			transform: rotate(135deg);
		}

		&.right .arrow {
			transform: rotate(-45deg);
		}
	}

	p {
		user-select: none;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		padding-left: 20px;
		margin-top: 0px;
		font-size: 28px;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
			"Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		font-weight: 500;
	}
	@media (max-width: 768px) {
		.scroll-btn {
			visibility: hidden;
		}
	}
</style>
