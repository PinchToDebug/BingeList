import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";

const JWT_SECRET = env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();
	if (!token) {
		return json({ valid: false }, { status: 404 });
	}
	try {
		jwt.verify(token, JWT_SECRET);
		return json({ valid: true });
	} catch {
		//	return json({ valid: false }, { status: 401 });
	}
	return json({ valid: false }, { status: 500 });
};
