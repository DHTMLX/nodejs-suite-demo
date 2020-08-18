import { notFound, invalidRequest } from "../utils/responses";

export default function (app, db) {
	app.get("/projects", async (_req, res) => {
		const projects = await db.all("SELECT * FROM projects;");

		res.json(projects);
	});

	app.get("/projects/:id", async (req, res) => {
		const { id } = req.params;

		const projects = await db.get("SELECT * FROM projects WHERE id=?;", id);
		if (!projects) {
			notFound(res);
		} else {
			res.json(projects);
		}
	});

	app.post("/projects", async (req, res) => {
		const { project, owner, start_date, end_date, status, hours, balance, paid } = req.body;

		if (!project || !owner || !start_date || !end_date || !status || !hours || !balance) {
			invalidRequest(res);
		} else {
			const {
				lastID,
			} = await db.run(
				"INSERT INTO projects ( project, owner, start_date, end_date, status, hours, balance, paid) VALUES (?,?,?,?,?,?,?,?);",
				[project, owner, start_date, end_date, status, hours, balance, paid]
			);
			res.setHeader("Location", `/projects/${lastID}`);
			res.status(201).json({ id: lastID });
		}
	});

	app.put("/projects/:id", async (req, res) => {
		const id = Number(req.params.id);
		const projects = await db.get("SELECT * FROM projects WHERE id=?;", id);
		if (!projects) {
			notFound(res);
		} else {
			const { project, owner, start_date, end_date, status, hours, balance, paid } = req.body;

			if (!project || !owner || !start_date || !end_date || !status || !hours || !balance) {
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

	app.delete("/projects/:id", async (req, res) => {
		const { id } = req.params;
		const projects = await db.get("SELECT * FROM projects WHERE id=?;", id);
		if (!projects) {
			notFound(res);
		} else {
			await db.run("DELETE from projects WHERE id=?", [id]);
			res.sendStatus(204);
		}
	});
}
