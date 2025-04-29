<script lang="ts">
	import { goto } from "$app/navigation";

	let loading = false;
	let message = "";

	const handleFetchData = async () => {
		loading = true;
		message = "Fetching and inserting shows...";
		let fetchedAll = false;
		try {
			let res = await fetch("/api/v1/dbload", { method: "POST" });

			if (res.status === 200) {
				alert("all good");
			} else {
				const rrr = await res.json();
				fetchedAll = rrr.message.includes("FETCHED_ALL_PAGES");
			}
		} catch (error) {
			console.log(error);
		} finally {
			if (fetchedAll) {
				goto("/");
			}
			loading = false;
		}
	};
</script>

<div class="container">
	<h1>Database is empty!</h1>
	<button on:click={handleFetchData} disabled={loading}>
		{loading ? "Fetching..." : "Fetch and Insert Shows"}
	</button>
</div>

<style>
	.container {
		font-family:
			Helvetica Neue,
			Helvetica,
			Arial,
			sans-serif;
		color: rgb(211, 211, 211);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		border-radius: 5px;
		background-color: rgb(63, 58, 109);

		color: white;
		border: none;
	}

	button:hover {
		background-color: rgb(43, 38, 89);
	}
</style>
