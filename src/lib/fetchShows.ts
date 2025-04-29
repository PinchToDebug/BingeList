import { db } from "$lib/server/db";
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchShows() {
	let currentPage = 0;
	let allShows: any[] = [];

	try {
		while (true) {
			const response = await fetch(
				`http://api.tvmaze.com/shows?page=${currentPage}`
			);

			if (!response.ok) {
				if (response.json.length == 0) {
					throw new Error("FETCHED_ALL_PAGES");
				} else {
					throw new Error(
						`Failed to fetch http://api.tvmaze.com/shows?page=${currentPage}`
					);
				}
			}
			const data = await response.json();
			console.log("more shows to fetch." + data.length);

			if (data.length === 0) {
				throw new Error("FETCHED_ALL_PAGES");
			}

			const expandedShows = data.map((show: any) => ({
				id: show.id,
				name: show.name,
				show_data: show,
			}));

			await db.run("BEGIN TRANSACTION");

			for (const show of expandedShows) {
				try {
					const { id, name, show_data } = show;

					const existingShow = await db.get(
						`SELECT * FROM shows WHERE id = ?`,
						[id]
					);

					if (existingShow) {
						if (
							JSON.stringify(JSON.parse(existingShow.show_data)) !==
							JSON.stringify(show_data)
						) {
							await db.run(`UPDATE shows SET show_data = ? WHERE id = ?`, [
								JSON.stringify(show_data),
								id,
							]);
							console.log(`Updated show: ${name} (ID: ${id})`);
						} else {
							console.log(`No changes for show: ${name} (ID: ${id})`);
						}
					} else {
						await db.run(
							`INSERT INTO shows (id, name, show_data) VALUES (?, ?, ?)`,
							[id, name, JSON.stringify(show_data)]
						);
						console.log(`Inserted show: ${name} (ID: ${id})`);
					}
				} catch (insertError) {
					console.error(`Error processing show: ${show.name}`, insertError);
				}
			}

			await db.run("COMMIT");

			allShows = allShows.concat(expandedShows);

			if (data.length < 1) {
				console.log("Fetched all available pages.");
				break;
			}
			currentPage++;
			await sleep(50);
		}

		console.log("All shows fetched and inserted into the database");

		return allShows;
	} catch (err) {
		if (err instanceof Error) {
			console.error("Error fetching or inserting shows: " + err.message);
			if (err.message.includes("FETCHED_ALL_PAGES")) {
				throw new Error("FETCHED_ALL_PAGES");
			}
		}
	}
}
