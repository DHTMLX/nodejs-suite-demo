import { notFound, invalidRequest } from "../utils/responses";

export default function (app) {
	app.get("/chart", async (_req, res) => {
		res.status(200).send({ tick: tick });
	});
}
