import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// import config from "./utils/dbConfig";
import { notFound } from "./utils/responses";

// import initDB from "./database/initDB";

// import createCitiesRoute from "./routes/cities";
// import createBooksRoute from "./routes/books";
// import createAnimalsRoute from "./routes/animals";
// import createTreeItemsRoute from "./routes/treeItems";
import createFormRoute from "./routers/form";

export default async function () {
	// const db = await initDB(config.dbPath);
	const app = express();

	app.use(cors());
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.json({ limit: "5mb" }));
	app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

	createFormRoute(app);

	// createCitiesRoute(app, db);
	// createBooksRoute(app, db);
	// createAnimalsRoute(app, db);
	// createTreeItemsRoute(app, db);

	app.use((_, res) => {
		notFound(res);
	});

	return app;
}
