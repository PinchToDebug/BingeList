import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

const JWT_SECRET = env.JWT_SECRET;

export const getUser = (token: string | undefined): string => {
	if (!token) {
		throw error(401, "Unauthorized: Missing token");
	}
	try {
		const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
		if (!decodedToken || !decodedToken.id) {
			throw error(401, "Unauthorized: Invalid token");
		}
		return decodedToken.id;
	} catch (err) {
		console.error("Error verifying token:", err);
		throw error(401, "Unauthorized: Invalid token");
	}
};
