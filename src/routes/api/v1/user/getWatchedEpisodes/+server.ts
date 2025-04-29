import { error, json, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { getUser } from "$lib/server/getUser";

export const POST: RequestHandler = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");

	const userId = getUser(token);
	if (!userId) throw error(401, "Unauthorized: Invalid token");

	const { showId } = await request.json();
	if (!showId) throw error(400, "Bad Request: Missing showId");

	try {
		const watchedEpisodes = await db.all(
			"SELECT season_id, episode_id FROM watched_episodes WHERE user_id = ? AND show_id = ?",
			[userId, showId]
		);

		return json({ success: true, watchedEpisodes });
	} catch (err) {
		console.error(err);
		throw error(500, "Internal Server Error: Failed to fetch watched episodes");
	}
};
