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

	app.post("/personal", async (req, res) => {
		const { name, post, phone, mail, photo, birthday, start } = req.body;

		if (!name || !post || !phone || !mail || !birthday || !photo || !start) {
			invalidRequest(res);
		} else {
			const id = `${Date.now().toString()}_id`;

			await db.run("INSERT INTO personal (name, post, phone, mail, photo, birthday, start, id) VALUES (?,?,?,?,?,?,?,?);", [
				name,
				post,
				phone,
				mail,
				photo,
				birthday,
				start,
				id,
			]);
			res.setHeader("Location", `/personal/${id}`);
			res.status(201).json({ id });
		}
	});

	app.put("/personal/:id", async (req, res) => {
		const id = req.params.id;
		const personal = await db.get("SELECT * FROM personal WHERE id=?;", id);
		if (!personal) {
			notFound(res);
		} else {
			const { name, post, phone, mail, photo, birthday, start } = req.body;

			if (!name || !post || !phone || !mail || !birthday || !photo || !start) {
				invalidRequest(res);
			} else {
				await db.run("UPDATE personal SET name=?, post=?, phone=?, mail=?, photo=?, birthday=?, start=? WHERE id=?;", [
					name,
					post,
					phone,
					mail,
					photo,
					birthday,
					start,
					id,
				]);
				res.sendStatus(204);
			}
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
