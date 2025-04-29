import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get("token");

	return new Response(token ?? "", token ? { status: 200 } : { status: 404 });
};
export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete("token", {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	return new Response("Token cookie removed");
};
