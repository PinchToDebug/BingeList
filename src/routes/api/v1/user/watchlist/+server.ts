import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { getUser } from "$lib/server/getUser";

export const GET = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");
	const userId = getUser(token);

	try {
		const shows = await db.all(
			`SELECT shows.id, shows.name, shows.show_data
            FROM user_shows
            JOIN shows ON user_shows.show_id = shows.id
            WHERE user_shows.user_id = ?`,
			[userId]
		);
		const parsedShows = shows
			.map((show: any) => {
				const showData = JSON.parse(show.show_data);

				if (showData.image?.medium != null) {
					return { show, show_data: showData };
				}
				return null;
			})
			.filter((show: any) => show !== null);
		return new Response(JSON.stringify({ shows: parsedShows }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("Error fetching user's shows:", err);
		throw error(500, "Internal Server Error: Failed to fetch user's shows");
	}
};
