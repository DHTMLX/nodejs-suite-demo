import Busboy from "busboy";
import fs from "fs";
import path from "path";
import { invalidRequest, notFound } from "../utils/responses";

export default function (app) {
	app.post("/form/login", async (req, res) => {
		if (!req.body) {
			invalidRequest(res);
		}
		res.status(200).send(JSON.stringify(req.body, null, 2));
	});

	app.post("/form/upload", async (req, res) => {
		if (req.method === "POST") {
			const busboy = new Busboy({ headers: req.headers });
			const response = {};

			busboy.on("file", (fieldname, file, filename) => {
				const saveTo = path.join(__dirname, "../upload/files/") + filename;
				response.link = `/form/upload/files/${filename}`;

				file.pipe(fs.createWriteStream(saveTo));
			});

			busboy.on("finish", () => {
				res.json(response);
			});

			return req.pipe(busboy);
		}

		notFound(res);
		res.end();
	});
}
