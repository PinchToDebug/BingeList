import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { getUser } from "$lib/server/getUser";

export const POST: RequestHandler = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");
	const userId = getUser(token);

	const body = await request.json();
	const { showId, seasonId, episodeId } = body;

	try {
		await db.run(
			"INSERT INTO watched_episodes (user_id, show_id, season_id, episode_id) VALUES (?, ?, ?, ?)",
			userId,
			showId,
			seasonId,
			episodeId
		);

		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (err) {
		console.error(err);
		throw error(500, "Internal Server Error: Failed to fetch user's shows");
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");
	const userId = getUser(token);

	const body = await request.json();
	const { showId, seasonId, episodeId } = body;

	try {
		await db.run(
			"DELETE FROM watched_episodes WHERE user_id = ? AND show_id = ? AND season_id = ? AND episode_id = ?",
			userId,
			showId,
			seasonId,
			episodeId
		);

		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (err) {
		console.error(err);
		throw error(500, "Internal Server Error: Failed to fetch user's shows");
	}
};
