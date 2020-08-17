import { invalidRequest } from "../utils/responses";

export default function (app) {
	app.post("/form/login", async (req, res) => {
		if (!req.body) {
			invalidRequest();
		}
		res.status(200).send(JSON.stringify(req.body, null, 2));
	});
}
