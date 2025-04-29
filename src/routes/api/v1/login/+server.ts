import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "$lib/server/db";
import { env } from "$env/dynamic/private";

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	const user = await db.get("SELECT * FROM users WHERE username = ?", username);
	if (!user) {
		return json({ error: "Invalid username or password" }, { status: 401 });
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		return json({ error: "Invalid username or password" }, { status: 401 });
	}

	const token = jwt.sign(
		{ id: user.id, username: user.username },
		env.JWT_SECRET,
		{
			expiresIn: "12h",
		}
	);
	cookies.set("token", token, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	return json({
		token,
		user: {
			id: user.id,
			username: user.username,
			displayName: user.display_name,
		},
	});
};
