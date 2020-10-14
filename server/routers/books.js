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
		const { value, isFolder, parent, opened } = req.body;
		if (!value) {
			invalidRequest(res);
		} else {
			const id = `${Date.now().toString()}_id`;
			await db.run("INSERT INTO books (id, value, isFolder, parent, opened) VALUES (?,?,?,?,?);", [
				id,
				value,
				isFolder || false,
				parent,
				opened,
			]);
			res.setHeader("Location", `/books/${id}`);
			res.status(201).json({ id });
		}
	});

	app.put("/books/:id", async (req, res) => {
		const { id } = req.params;
		const treeItem = await db.get("SELECT * FROM books WHERE id=?;", id);
		if (!treeItem) {
			notFound(res);
		} else {
			const { value, isFolder, parent, opened } = req.body;
			if (!value) {
				invalidRequest(res);
			} else {
				await db.run("UPDATE books SET value=?, isFolder=?, parent=?, opened=? WHERE id=?;", [
					value,
					isFolder || false,
					parent || null,
					opened || false,
					id,
				]);
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
