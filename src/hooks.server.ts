import { db } from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
export const handle: Handle = async ({ event, resolve }) => {
	try {
		await db;
	} catch (error) {
		console.error("Error initializing database in the hook:", error);
	}
	return resolve(event);
};
