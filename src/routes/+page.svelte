<script lang="ts">
	import { onMount } from "svelte";
	import Card from "$lib/components/ContentCard.svelte";
	import Search from "$lib/components/Search.svelte";
	import Menubar from "$lib/components/Menubar.svelte";
	import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
	import Featured from "$lib/components/FeaturedInCategory.svelte";
	import ToTop from "$lib/components/ScrollToTop.svelte";
	import checkToken from "$lib/utility/checkToken";
	import CheckShow from "$lib/components/CheckShow.svelte";

	let switchViews = false;
	let showWatchList = false;
	let isSearching = false;
	let shows: any[] = [];
	let watchList: any[] = [];
	let userShowList: number[] = [];
	let loading = true;
	let noResults = false;
	let timeout: NodeJS.Timeout;
	let token = "";

	$: switchViews, toggleView();

	async function toggleView() {
		if (token == "" || !(await checkToken(token))) {
			return;
		}
		await fetchUserWatchList();
		showWatchList = !showWatchList;
		console.log(showWatchList ? "On view WATCH LIST" : "On view FEATURED");
	}

	export const fetchUserWatchList = async () => {
		if (!token) return;

		const res = await fetch("/api/v1/user/watchlist", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const data = await res.json();
			watchList = data.shows;
		} else {
			console.error("Fetch failed:", await res.text());
		}
	};

	async function fetchShows() {
		loading = true;
		const res = await fetch("/api/v1/featured");
		if (res.ok) {
			let data = await res.json();
			shows = data.shows;
			noResults = shows.length === 0;
			loading = false;
		} else {
			console.error("Fetch failed:", await res.text());
		}
	}

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

	async function handleSearch(query: string) {
		if (query.trim().length !== 0 && query.trim().length <= 2) {
			return;
		}
		clearTimeout(timeout);
		loading = true;
		timeout = setTimeout(async () => {
			if (!query.trim()) {
				await fetchShows();
				return;
			}

			shows = [];
			noResults = false;

			try {
				let response = await fetch(
					`/api/v1/search?q=${encodeURIComponent(query)}`
				);
				let data = await response.json();
				shows = data.shows;
				noResults = shows.length === 0;
			} catch (err) {
				console.error("Search failed:", err);
			} finally {
				loading = false;
				if (await checkToken(token)) {
					fetchUserWatchListIDs();
				}
			}
		}, 200);
	}

	onMount(async () => {
		fetchShows();
		const res = await fetch("/");
		token = await res.text();
		if (token !== "" && (await checkToken(token))) {
			fetchUserWatchListIDs();
			fetchUserWatchList();
		}
	});

	let showPopup = false;
	let popupData: any = [];
	let toggleTitle = false;
	const handleClosePopup = () => {
		showPopup = false;
	};
</script>

<CheckShow {showPopup} {popupData} onClose={handleClosePopup} />
<div class="body">
	<div></div>
	<Menubar>
		<Search onSearch={handleSearch} bind:Searching={isSearching} />
		<HamburgerMenu bind:switchViews />
	</Menubar>
	<ToTop />
	<div class="main">
		{#if loading}{:else if noResults}
			<p>No results found.</p>
		{:else if isSearching && !showWatchList}
			<div class="card-wrapper-container">
				<div class="card-wrapper">
					{#each shows as show}
						<Card
							data={show}
							inList={userShowList.includes(show.show_data.id)}
							bind:popupData
							bind:showDetails={showPopup}
						/>
					{/each}
				</div>
			</div>
		{:else if showWatchList}
			<div class="card-wrapper-container">
				<div class="card-wrapper">
					{#each watchList as show}
						<Card
							data={show}
							inList={true}
							bind:popupData
							bind:showDetails={showPopup}
						/>
					{/each}
				</div>
			</div>
		{:else}
			<Featured datas={shows} bind:showPopup bind:popupData category="Action" />
			<Featured datas={shows} bind:showPopup bind:popupData category="Family" />
			<Featured
				datas={shows}
				bind:showPopup
				bind:popupData
				category="Adventure"
			/>
			<Featured
				datas={shows}
				bind:showPopup
				bind:popupData
				category="Science-Fiction"
			/>
			<Featured
				datas={shows}
				bind:showPopup
				bind:popupData
				category="Fantasy"
			/>
			<Featured datas={shows} bind:showPopup bind:popupData category="Anime" />
			<Featured
				datas={shows}
				bind:showPopup
				bind:popupData
				category="Thriller"
			/>
			<Featured datas={shows} bind:showPopup bind:popupData category="Horror" />
		{/if}
	</div>
</div>

<style lang="scss">
	.card-wrapper-container {
		.card-wrapper {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			width: fit-content;
			padding: 10px;
			gap: 5px;
			align-items: flex-start;
		}
		margin: 0 auto;
		max-width: 100%;
		padding-bottom: 20px;
		align-content: center;
	}

	.main {
		padding-top: 80px;
		overflow-x: hidden;
	}
	@media (max-width: 768px) {
		.main {
			padding-top: 30px;
			padding-bottom: 70px;
		}
	}
</style>
