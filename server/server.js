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

	app.use((err, req, res) => {
		console.error(err);
		if (process.env.NODE_ENV === "production") {
			res.status(500).send("Internal Server Error");
		} else {
			res.status(500).send(err.stack);
		}
	});

	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})();
