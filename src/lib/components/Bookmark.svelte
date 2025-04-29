<script lang="ts">
	export let inList: boolean;
	export let id: number;

	let isInList = inList;

	let fillColor = isInList ? "white" : "none";
	const toggleShowList = async () => {
		let token = await (await fetch("/")).text();
		if (token === "") return;
		const method = inList ? "DELETE" : "POST";
		const res = await fetch("/api/v1/user/list", {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		fillColor = inList ? "white" : "none";
		if (res.ok) {
			inList = !inList;
			isInList = !isInList;
			console.log(`Show ${inList ? "added" : "removed"} from list`);
		} else {
			console.error("Failed to update show list");
		}
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="container" on:click={toggleShowList}>
	<div class="bookmark">
		<svg
			width="100%"
			height="100%"
			fill={inList ? "white" : "none"}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
</div>

<style>
	.bookmark {
		color: rgb(255, 255, 255);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 36px;
		height: 36px;
		padding-left: 6px;
		padding-top: 6px;
	}

	.container {
		cursor: pointer;
		transition: 0.1s;
		border-radius: 19px;
		position: relative;
		width: 36px;
		height: 36px;
		mask-image: url("/circle.svg");
		mask-size: cover;
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		background-color: rgba(97, 97, 97, 0.5);
		margin-left: 7px;
		margin-top: 3px;
		z-index: 20;
	}
	.container:hover {
		transform: scale(1.2);
	}
	.container:active {
		transition: 0.02s;
		transform: scale(1.1);
	}
	@media (max-width: 768px) {
		.container {
			margin: 10px;
			margin-left: 13px;
			margin-top: 10px;
			transition: 0.3s;
			transform: scale(1.5);
		}
		.container:hover {
			transform: scale(1.4);
		}
		.container:active {
			transition: 0.1s;
			transform: scale(1.2);
		}
	}
</style>
