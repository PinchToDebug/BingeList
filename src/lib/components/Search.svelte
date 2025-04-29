<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	export let onSearch: (query: string) => void;
	let searchQuery = "";
	let inputElement: HTMLInputElement;

	function handleInput(event: Event) {
		searchQuery = (event.target as HTMLInputElement).value;
		onSearch(searchQuery);
	}
	export let Searching: boolean;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape" && searchQuery !== "") {
			searchQuery = "";
			Searching = false;
			onSearch(searchQuery);
			inputElement.blur();
		} else if (
			event.key.length === 1 &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey
		) {
			inputElement.focus();
			Searching = true;
			Searching = searchQuery.length >= 2;
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener("keydown", handleKeyDown);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener("keydown", handleKeyDown);
		}
	});
</script>

<div class="container">
	<svg
		class="searchIcon"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	<input
		class="searchbar"
		type="text"
		placeholder="Search..."
		bind:value={searchQuery}
		on:input={handleInput}
		bind:this={inputElement}
	/>
</div>

<style lang="scss">
	.searchIcon {
		padding-left: 12px;
	}

	.container {
		border: 1px solid rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		color: rgb(172, 172, 172);
		width: 200px;
		font-size: 14px;
		border-radius: 15px;
		left: 0;
		right: 0;
		transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.4s;
		margin: 0 auto;
		max-width: 400px;
		width: 60%;
		padding: 0px;
		background-color: rgba(18, 17, 22, 0.7);
		backdrop-filter: blur(20px);
		transition: 0.15s ease;
		&:hover {
			background-color: rgba(40, 38, 49, 0.7);
			width: 500px;
			max-width: 500px;
		}
		&:focus-within {
			background-color: rgba(40, 38, 49, 0.7);
			width: 500px;
			max-width: 500px;
		}
	}

	.searchbar {
		transition: 0.1s;
		width: 78%;
		color: white;
		line-height: 40px;
		font-size: 18px;
		border: none;
		background-color: transparent;
		padding-left: 10px;
		mask: linear-gradient(to right, black 90%, transparent 100%) content-box
			100% 100% / 200% 200% no-repeat;
		mask-position: 100% 100%;
	}

	.searchbar:focus {
		mask: linear-gradient(to right, black 90%, transparent 100%) content-box
			100% 100% / 200% 200% no-repeat;
		outline: none;
	}

	.searchbar::placeholder {
		font-weight: 300;
		color: rgb(172, 172, 172);
	}

	@media (max-width: 768px) {
		.container:hover {
			width: 65%;
			max-width: 65%;
		}
		.container {
			max-width: 65%;
			&:focus-within {
				width: 65%;
				max-width: 65%;
			}
		}
	}
	.container:hover .searchbar {
		mask-position: 0% 0%;
	}
	.searchbar::selection {
		background-color: rgb(63, 58, 109);
	}
</style>
