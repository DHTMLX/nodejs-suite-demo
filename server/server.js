/* eslint-disable no-console */
import createApp from "./app";
import "dotenv/config";

process.on("uncaughtException", e => {
	console.error(e);
	process.exit(1);
});

process.on("unhandledRejection", e => {
	console.error(e);
	process.exit(1);
});

const { PORT } = process.env;

(async () => {
	const app = await createApp();
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})();
