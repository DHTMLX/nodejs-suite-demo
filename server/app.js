import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
// eslint-disable-next-line import/no-extraneous-dependencies
import Faye from "faye";

import config from "./utils/dbConfig";
import { notFound } from "./utils/responses";

import initDB from "./database/initDatabase";

import createFormRoute from "./routers/form";
import createPersonalRoute from "./routers/personal";
import createProjectsRoute from "./routers/projects";
import createBooksRoute from "./routers/books";
import createStatistic from "./routers/statistic";
import createSaveRoute from "./routers/save";

export default async function () {
	const db = await initDB(config.dbPath);
	const app = express();
	const bayeux = new Faye.NodeAdapter({ mount: "/sync", timeout: 45 });

	app.use(cors());
	app.use(bodyParser.json({ limit: "5mb" }));
	app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
	app.use(express.static(`${__dirname}/upload`));

	createFormRoute(app);
	createPersonalRoute(app, db);
	createProjectsRoute(app, bayeux, db);
	createBooksRoute(app, db);
	createStatistic(app, db);
	createSaveRoute(app, db);

	app.use((_, res) => {
		notFound(res);
	});
	app.use((err, _req, res) => {
		// eslint-disable-next-line no-console
		console.error(err);
		if (process.env.NODE_ENV === "production") {
			res.status(500).send("Internal Server Error");
		} else {
			res.status(500).send(err.stack);
		}
	});

	const server = createServer(app);
	bayeux.attach(server);

	return server;
}
