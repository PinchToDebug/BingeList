import { fetchShows } from "$lib/fetchShows";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent) {
	try {
		console.log("Starting DB load...");

		const shows = await fetchShows();

		console.log("Show fetching complete.");

		return new Response(
			JSON.stringify({
				message: "Shows fetched and inserted successfully",
				shows,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		let msg = "";
		if (error instanceof Error) {
			msg = error.message;
			if (msg.includes("FETCHED_ALL_PAGES")) {
				msg = "FETCHED_ALL_PAGES";
			}
		}
		return new Response(
			JSON.stringify({
				message:
					msg == "" ? "Failed to fetch and insert shows" : "FETCHED_ALL_PAGES",
				error: error,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
