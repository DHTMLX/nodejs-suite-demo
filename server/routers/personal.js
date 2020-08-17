import { notFound, invalidRequest } from "../utils/responses";

export default function (app, db) {
	app.get("/personal", async (_req, res) => {
		const personal = await db.all("SELECT * FROM personal;");

		res.json(personal);
	});

	app.get("/personal/:id", async (req, res) => {
		const { id } = req.params;

		const personal = await db.get("SELECT * FROM personal WHERE id=?;", id);
		if (!personal) {
			notFound(res);
		} else {
			res.json(personal);
		}
	});

	app.delete("/personal/:id", async (req, res) => {
		const { id } = req.params;
		const personal = await db.get("SELECT * FROM personal WHERE id=?;", id);
		if (!personal) {
			notFound(res);
		} else {
			await db.run("DELETE from personal WHERE id=?", [id]);
			res.sendStatus(204);
		}
	});
}
