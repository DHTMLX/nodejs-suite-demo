import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import config from "./utils/dbConfig";
import { notFound } from "./utils/responses";

import initDB from "./database/initDatabase";

import createFormRoute from "./routers/form";
import createPersonalRoute from "./routers/personal";
import createProjectsRoute from "./routers/projects";
import createBooksRoute from "./routers/books";

export default async function () {
	const db = await initDB(config.dbPath);
	const app = express();

	app.use(cors());
	app.use(bodyParser.json({ limit: "5mb" }));
	app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
	app.use(express.static(`${__dirname}/upload`));

	createFormRoute(app);
	createPersonalRoute(app, db);
	createProjectsRoute(app, db);
	createBooksRoute(app, db);

	app.use((_, res) => {
		notFound(res);
	});

	return app;
}
