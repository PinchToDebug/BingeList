import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
	try {
		const url = new URL(event.request.url);

		let searchQuery = url.searchParams.get("q")?.toLowerCase();

		if (searchQuery!.length < 2) {
			return new Response(JSON.stringify({ shows: [] }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		const shows = await db.all(
			`SELECT id, name, show_data FROM shows WHERE name LIKE ? COLLATE NOCASE LIMIT 50`,
			[`%${searchQuery}%`]
		);

		const parsedShows = shows
			.map((show: any) => ({
				...show,
				show_data: JSON.parse(show.show_data),
			}))
			.filter((show: any) => show.show_data.image?.medium != null);

		return new Response(JSON.stringify({ shows: parsedShows }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Search API Error:", error);
		return new Response(
			JSON.stringify({ message: "Database search failed", error }),
			{ status: 500 }
		);
	}
}
