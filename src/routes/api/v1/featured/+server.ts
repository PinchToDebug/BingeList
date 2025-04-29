import { db } from "$lib/server/db";

export async function GET() {
	try {
		const shows = await db.all(
			`SELECT id, name, show_data
			 FROM shows
			 WHERE json_type(show_data, '$') = 'object'
			   AND json_extract(show_data, '$.rating.average') IS NOT NULL
			 ORDER BY json_extract(show_data, '$.premiered') DESC,
					  json_extract(show_data, '$.weight') DESC
			 LIMIT 400`
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
	} catch (error) {
		console.error("Error fetching shows:", error);
		return new Response(
			JSON.stringify({ message: "Failed to fetch shows", error }),
			{ status: 500 }
		);
	}
}
