import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";

export async function load({ url }) {
	const currentPath = url.pathname;

	if (currentPath !== "/setup") {
		const row = await db.get("SELECT COUNT(*) AS count FROM shows");
		if (row.count === 0) {
			throw redirect(307, "/setup");
		}
	}

	return {};
}
