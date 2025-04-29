import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "$lib/server/db";
import { env } from "$env/dynamic/private";

export const POST: RequestHandler = async ({ request }) => {
	const { username, password, displayName } = await request.json();

	if (!username || !password || !displayName) {
		return json({ error: "Missing required fields" }, { status: 400 });
	}

	const existingUser = await db.get(
		"SELECT * FROM users WHERE username = ?",
		username
	);
	if (existingUser) {
		return json({ error: "Username already taken" }, { status: 409 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	await db.run(
		"INSERT INTO users (username, displayname, password) VALUES (?, ?, ?)",
		username,
		displayName,
		hashedPassword
	);

	const user = await db.get("SELECT * FROM users WHERE username = ?", username);
	const token = jwt.sign(
		{ id: user.id, username: user.username },
		env.JWT_SECRET,
		{
			expiresIn: "12h",
		}
	);

	return json({ token });
};
