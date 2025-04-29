import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";

export async function load() {
	const row = await db.get("SELECT COUNT(*) AS count FROM shows");
	if (row.count > 0) {
		throw redirect(307, "/");
	}
	return {};
}
