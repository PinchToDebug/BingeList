<script lang="ts">
	import Bookmark from "./Bookmark.svelte";
	import { onMount } from "svelte";
	export let data;
	export let popupData;
	export let inList: boolean;
	export let showDetails: boolean;

	let token = "";
	let windowWidth = 0;
	let isDragging = false;
	let startX = 0;
	let startY = 0;

	data = data.show_data;

	const handleMouseDown = (e: MouseEvent) => {
		startX = e.clientX;
		startY = e.clientY;
		isDragging = false;
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
			isDragging = true;
		}
	};

	const handleMouseUp = () => {
		if (!isDragging) {
			showDetails = true;
			popupData = data;
		}
	};

	function getWidth() {
		windowWidth = window.innerWidth;
	}

	onMount(async () => {
		const res = await fetch("/");
		token = await res.text();
		getWidth();
		window.addEventListener("resize", getWidth);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if data.image?.medium != null}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="frame">
		<div class="background-image">
			<!-- svelte-ignore a11y_missing_attribute -->
			<img src={data.image?.medium} />
		</div>
		<div class="innerFrame">
			{#if token != ""}<div class="bookmark">
					<Bookmark id={data.id} {inList} />
				</div>
			{/if}

			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				class="img-wrapper"
				on:mousedown={handleMouseDown}
				on:mousemove={handleMouseMove}
				on:mouseup={handleMouseUp}
			>
				<img class="img" alt={data.name || ""} src={data.image?.medium} />
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<p
				class="title"
				on:mousedown={handleMouseDown}
				on:mousemove={handleMouseMove}
				on:mouseup={handleMouseUp}
			>
				{data.name}
			</p>
			<div class="genreContainer">
				<div class="badge badgePremiered">
					{data.premiered?.substring(0, 4) ?? "TBA"}
				</div>

				{#each data.genres as genre}
					<div class="badge">{genre}</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.background-image {
		position: absolute;

		pointer-events: none;
		top: 0;
		opacity: 0;
		width: 100%;
		transition: opacity 0.25s;
		height: 100%;
		img {
			object-fit: contain;
			opacity: 0.5;
			height: 100%;
			filter: blur(100px) contrast(1.2) brightness(0.8) saturate(1.2);
		}
		z-index: -2;
		user-select: none;
		-webkit-touch-callout: none;
		user-select: none;
		-webkit-user-select: none;
	}
	.bookmark {
		z-index: 9;
		position: absolute;
		visibility: hidden;
	}
	.frame {
		height: fit-content;
		position: relative;
		cursor: pointer !important;
		min-width: 170px;
		width: 170px;
		clip-path: stroke-box;
		margin-right: 10px;
		padding: 5px;
		border-radius: 15px;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
			"Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		transform-origin: top center;
		transition: background-color 0.25s;

		.innerFrame {
			overflow-wrap: break-word;
			user-select: none;
			-webkit-touch-callout: none;
			user-select: none;
			-webkit-user-select: none;
			transition: transform 0.25s ease;
			transition-timing-function: cubic-bezier(0.17, 0.67, 0.25, 0.9);

			.img {
				pointer-events: none;
				transition: transform 0.25s ease;
				transition-timing-function: cubic-bezier(0.17, 0.67, 0.25, 0.9);
				border-radius: 15px;
				width: 100%;
				&:active {
					pointer-events: none;
				}
			}
			.title {
				&::selection {
					background-color: rgb(63, 58, 109);
				}
				-webkit-touch-callout: text;
				user-select: text;
				-webkit-user-select: text;
				margin-top: 5px;
				color: rgb(233, 233, 233);
				font-weight: 600;
				font-size: 15px;
				margin-bottom: -10px;
			}
			.badge {
				color: rgb(177, 177, 177);
				font-size: 12px;
				margin-top: 4px;
				background-color: rgba(255, 255, 255, 0.082);
				width: fit-content;
				border-radius: 5px;
				padding-left: 5px;
				padding-right: 5px;
				margin-right: 5px;
				&.badgePremiered {
					background-color: rgba(97, 89, 165, 0.363);
				}
			}
			.genreContainer {
				display: flex;
				flex-wrap: wrap;
				visibility: none;
				padding-top: 15px;
			}
		}
	}

	.frame:hover .innerFrame {
		transform: scale(0.95);
	}
	.frame:hover .bookmark {
		visibility: visible !important;
		z-index: 1;
	}
	.frame:hover .img {
		transform: translate(0%, -4px);
	}
	.frame:hover .genreContainer {
		visibility: visible;
	}
	.frame:hover {
		.background-image {
			opacity: 100;
		}
		background-color: rgba(255, 255, 255, 0.045);
	}
	@media (max-width: 768px) {
		.background-image {
			opacity: 0;
			img {
				filter: none;
			}
		}
		.frame:hover {
			.background-image {
				opacity: 0;
				img {
					filter: none;
				}
			}
			background-color: rgba(255, 255, 255, 0.045);
		}
	}
</style>
