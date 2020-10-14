/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
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
			"CREATE TABLE IF NOT EXISTS personal (id TEXT PRIMARY KEY, name TEXT, post TEXT, phone TEXT, mail TEXT, photo TEXT, birthday TEXT, start TEXT);"
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

	// PROJECTS
	{
		await db.exec(
			"CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, project TEXT, owner TEXT, start_date TEXT, end_date TEXT, status TEXT, hours INTEGER, balance INTEGER, paid INTEGER);"
		);
		const { count } = await db.get("SELECT COUNT(*) AS count FROM projects;");
		if (count === 0) {
			for (const { id, project, owner, start_date, end_date, status, hours, balance, paid } of data.projects) {
				await db.get(
					"INSERT INTO projects (id, project, owner, start_date, end_date, status, hours, balance, paid) VALUES (?,?,?,?,?,?,?,?,?);",
					[id, project, owner, start_date, end_date, status, hours, balance, paid]
				);
			}
		}
	}

	// BOOKS
	{
		await db.exec(
			"CREATE TABLE IF NOT EXISTS books (id TEXT PRIMARY KEY, value TEXT NOT NULL, isFolder INTEGER NOT NULL, parent TEXT, opened INTEGER NOT NULL );"
		);
		const { count } = await db.get("SELECT COUNT(*) AS count FROM books;");

		if (count === 0) {
			for (const { id, value, isFolder, parent, opened } of data.books) {
				await db.get("INSERT INTO books VALUES(?,?,?,?,?);", [id, value, isFolder, parent, opened]);
			}
		}
	}

	return db;
}
