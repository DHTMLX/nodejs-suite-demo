/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import { notFound, invalidRequest } from "../utils/responses";

export default function (app, db) {
	app.get("/save/load", async (_req, res) => {
		const projects = await db.all("SELECT * FROM projects;");

		res.json(projects);
	});

	app.post("/save", async (req, res) => {
		const { id } = req.body;
		const projects = await db.get("SELECT * FROM projects WHERE id=?;", id);
		if (!projects) {
			notFound(res);
		} else {
			const { project, owner, start_date, end_date, status, hours, balance, paid } = req.body;

			const props = ["project", "owner", "start_date", "end_date", "status", "hours", "balance", "paid"];
			const valid = props.every(prop => req.body.hasOwnProperty(prop) && typeof prop !== "undefined");

			if (!valid) {
				invalidRequest(res);
			} else {
				await db.run(
					"UPDATE projects SET project=?, owner=?, start_date=?, end_date=?, status=?, hours=?, balance=?, paid=? WHERE id=?;",
					[project, owner, start_date, end_date, status, hours, balance, paid, id]
				);
				res.sendStatus(204);
			}
		}
	});

	app.put("/save", async (req, res) => {
		const { project, owner, start_date, end_date, status, hours, balance, paid } = req.body;
		const props = ["project", "owner", "start_date", "end_date", "status", "hours", "balance", "paid"];
		const valid = props.every(prop => req.body.hasOwnProperty(prop) && typeof prop !== "undefined");

		if (!valid) {
			invalidRequest(res);
		} else {
			const { lastID } = await db.run(
				"INSERT INTO projects ( project, owner, start_date, end_date, status, hours, balance, paid) VALUES (?,?,?,?,?,?,?,?);",
				[project, owner, start_date, end_date, status, hours, balance, paid]
			);
			res.setHeader("Location", `/projects/${lastID}`);
			res.status(201).json({ id: lastID });
		}
	});

	app.delete("/save", async (req, res) => {
		const { id } = req.body;
		const projects = await db.get("SELECT * FROM projects WHERE id=?;", id);
		if (!projects) {
			notFound(res);
		} else {
			await db.run("DELETE from projects WHERE id=?", [id]);
			res.sendStatus(204);
		}
	});
}
