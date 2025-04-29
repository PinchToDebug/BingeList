import { json, error } from "@sveltejs/kit";
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
		return json({ success: true, shows });
	} catch (err) {
		console.error("Error fetching user's shows:", err);
		throw error(500, "Internal Server Error: Failed to fetch user's shows");
	}
};

export const POST = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");
	const userId = getUser(token);

	try {
		const { id } = await request.json();

		if (!id) {
			throw error(400, "Bad Request: Show ID is required");
		}

		await db.run(
			`INSERT OR IGNORE INTO user_shows (user_id, show_id) VALUES (?, ?)`,
			[userId, id]
		);

		return json({ success: true, message: "Show added to user's list" });
	} catch (err) {
		console.error("Error adding show to user's list:", err);
		throw error(500, "Internal Server Error: Failed to add show to list");
	}
};

export const DELETE = async ({ request }) => {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) throw error(401, "Unauthorized: No token provided");
	const userId = getUser(token);

	try {
		const { id } = await request.json();

		if (!id) {
			throw error(400, "Bad Request: Show ID is required");
		}

		const result = await db.run(
			`DELETE FROM user_shows WHERE user_id = ? AND show_id = ?`,
			[userId, id]
		);

		if (result.changes === 0) {
			throw error(400, "Show not found in user's list");
		}

		return json({ success: true, message: "Show removed successfully" });
	} catch (err) {
		console.error("Error removing show:", err);
		throw error(500, "Internal Server Error: Failed to remove show");
	}
};
