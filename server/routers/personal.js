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
			const {
				lastID,
			} = await db.run("INSERT INTO personal (name, post, phone, mail, photo, birthday, start) VALUES (?,?,?,?,?,?,?);", [
				name,
				post,
				phone,
				mail,
				photo,
				birthday,
				start,
			]);
			res.setHeader("Location", `/personal/${lastID}`);
			res.status(201).json({ id: lastID });
		}
	});

	app.put("/personal/:id", async (req, res) => {
		const id = Number(req.params.id);
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
