export default async function checkToken(token: string): Promise<boolean> {
	if (!token) return false;

	const res = await fetch("/api/v1/verifytoken", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token }),
	});

	if (!res.ok) return false;

	const { valid } = await res.json();
	return valid;
}
