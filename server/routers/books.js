import { notFound, invalidRequest } from "../utils/responses";

export default function (app, db) {
	app.get("/books", async (_, res) => {
		const books = await db.all("SELECT * FROM books;");
		res.json(books);
	});

	app.get("/books/:id", async (req, res) => {
		const { id } = req.params;

		const treeItem = await db.get("SELECT * FROM books WHERE id=?;", id);
		if (!treeItem) {
			notFound(res);
		} else {
			res.json(treeItem);
		}
	});

	app.post("/books", async (req, res) => {
		const { id, value, isFolder, parent } = req.body;
		if (!id || !value) {
			invalidRequest(res);
		} else {
			await db.run("INSERT INTO books (id, value, isFolder, parent) VALUES (?,?,?,?);", [id, value, isFolder || false, parent]);
			res.setHeader("Location", `/books/${id}`);
			res.status(201);
		}
	});

	app.put("/books/:id", async (req, res) => {
		const { id } = req.params;
		const treeItem = await db.get("SELECT * FROM books WHERE id=?;", id);
		if (!treeItem) {
			notFound(res);
		} else {
			const { value, isFolder, parent } = req.body;
			if (!value) {
				invalidRequest(res);
			} else {
				await db.run("UPDATE books SET value=?, isFolder=?, parent=? WHERE id=?;", [value, isFolder || false, parent || null, id]);
				res.sendStatus(204);
			}
		}
	});

	app.delete("/books/:id", async (req, res) => {
		const { id } = req.params;
		const treeItem = await db.get("SELECT * FROM books WHERE id=?;", id);
		if (!treeItem) {
			notFound(res);
		} else {
			await db.run("DELETE from books WHERE id=?", [id]);
			res.sendStatus(204);
		}
	});
}