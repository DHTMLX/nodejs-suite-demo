/* eslint-disable no-use-before-define */
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
		upload(req, res, "upload");
	});

	app.post("/form/images", async (req, res) => {
		upload(req, res, "images");
	});

	const upload = async (req, res, folder) => {
		if (req.method === "POST") {
			const busboy = new Busboy({ headers: req.headers });
			const response = {};

			busboy.on("file", (_fieldname, file, filename) => {
				const saveTo = path.join(__dirname, `../upload/${folder}/`) + filename;
				response.link = `/form/upload/${folder}/${filename}`;
				response.name = filename;

				file.pipe(fs.createWriteStream(saveTo));
			});

			busboy.on("finish", () => {
				res.json(response);
			});

			return req.pipe(busboy);
		}

		notFound(res);
		res.end();
	};
}
