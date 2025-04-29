import { open } from "sqlite";
import sqlite3 from "sqlite3";
import * as path from "path";

const dbFilePath = path.resolve(process.cwd(), "database.db");

if (typeof window === "undefined") {
	console.log("Initializing database...");
	var db = await open({
		filename: dbFilePath,
		driver: sqlite3.Database,
	});

	const tableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='shows';`;
	const tableExists = await db.get(tableCheckQuery);

	if (!tableExists) {
		console.log("Table 'shows' does not exist. Creating schema...");
		await db.exec(`
			CREATE TABLE IF NOT EXISTS shows (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				show_data TEXT NOT NULL
			);
		`);
		console.log("Created 'shows' table.");
	} else {
		console.log("Table 'shows' already exists.");
	}

	const usersTableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`;
	const usersTableExists = await db.get(usersTableCheckQuery);

	if (!usersTableExists) {
		console.log("Table 'users' does not exist. Creating schema...");
		await db.exec(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT NOT NULL UNIQUE,
				displayname TEXT NOT NULL,
				password TEXT NOT NULL
			);
		`);
		console.log("Created 'users' table.");
	} else {
		console.log("Table 'users' already exists.");
	}

	const watchedEpisodesTableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='watched_episodes';`;
	const watchedEpisodesTableExists = await db.get(
		watchedEpisodesTableCheckQuery
	);
	if (!watchedEpisodesTableExists) {
		console.log("Table 'watched_episodes' does not exist. Creating schema...");
		await db.exec(`
			CREATE TABLE IF NOT EXISTS watched_episodes (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id INTEGER NOT NULL,
				show_id INTEGER NOT NULL,
				season_id INTEGER NOT NULL,
				episode_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			);
		`);
		console.log("Created 'watched_episodes' table.");
	} else {
		console.log("Table 'watched_episodes' already exists.");
	}

	// const episodesTableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='episodes';`;
	// const episodesTableExists = await db.get(episodesTableCheckQuery);

	// if (!episodesTableExists) {
	// 	console.log("Table 'episodes' does not exist. Creating schema...");
	// 	await db.exec(`
	// 		CREATE TABLE IF NOT EXISTS episodes (
	// 			id INTEGER PRIMARY KEY AUTOINCREMENT,
	// 			show_id INTEGER NOT NULL,
	// 			episode_name TEXT NOT NULL,
	// 			episode_data TEXT NOT NULL,
	// 			FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
	// 		);
	// 	`);
	// 	console.log("Created 'episodes' table.");
	// } else {
	// 	console.log("Table 'episodes' already exists.");
	// }

	const userShowsTableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='user_shows';`;
	const userShowsTableExists = await db.get(userShowsTableCheckQuery);

	if (!userShowsTableExists) {
		console.log("Table 'user_shows' does not exist. Creating schema...");
		await db.exec(`
			CREATE TABLE IF NOT EXISTS user_shows (
				user_id INTEGER NOT NULL,
				show_id INTEGER NOT NULL,
				PRIMARY KEY (user_id, show_id),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
			);
		`);
		console.log("Created 'user_shows' table.");
	} else {
		console.log("Table 'user_shows' already exists.");
	}
}
export { db };
