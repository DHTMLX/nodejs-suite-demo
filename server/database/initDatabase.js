import sqlite3 from "sqlite3";
import { open } from "sqlite";
import data from "./data";

if (process.env.NODE_ENV === "development") {
	sqlite3.verbose();
}

export default async function (dbPath) {
	const db = await open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
	// PERSONAL
	{
		await db.exec(
			"CREATE TABLE IF NOT EXISTS personal (id INTEGER PRIMARY KEY, name TEXT, post TEXT, phone TEXT, mail TEXT, photo TEXT, birthday TEXT, start TEXT);"
		);
		const { count } = await db.get("SELECT COUNT(*) AS count FROM personal;");

		if (count === 0) {
			for (const { id, name, post, phone, mail, photo, birthday, start } of data.personal) {
				await db.get("INSERT INTO personal (id, name, post, phone, mail, photo, birthday, start) VALUES (?,?,?,?,?,?,?,?);", [
					id,
					name,
					post,
					phone,
					mail,
					photo,
					birthday,
					start,
				]);
			}
		}
	}

	return db;
}
