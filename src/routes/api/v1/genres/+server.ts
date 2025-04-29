import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
	try {
		const shows = await db.all("SELECT show_data FROM shows LIMIT 5000");

		const genres: string[] = [];

		shows.forEach((show: any) => {
			try {
				const showData = JSON.parse(show.show_data);

				if (showData.genres) {
					showData.genres.forEach((genre: string) => {
						if (!genres.includes(genre)) genres.push(genre);
					});
				}
			} catch (err) {
				console.error("Error parsing show data", err);
			}
		});

		return new Response(JSON.stringify({ genres }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching genres", error);
		return new Response(
			JSON.stringify({ message: "Database query failed", error }),
			{ status: 500 }
		);
	}
}
