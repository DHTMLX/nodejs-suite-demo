export default function (app, db) {
	app.get("/static/personal", async (_req, res) => {
		const personal = await db.all("SELECT * FROM personal;");

		const state = [];
		const counter = {};
		const color = ["#ffffc0", "#ff916b", "#ff4169", "#863958", "#84bec3", "#ffff9c", "#ff7657", "#f93555", "#6d2e47", "#6b9a9e"];

		personal.forEach(({ post }) => {
			if (!counter[post]) {
				counter[post] = 1;
			} else {
				++counter[post];
			}
		});

		Object.entries(counter).forEach(([post, value], id) => {
			state.push({
				id,
				value,
				post,
				color: color[id],
			});
		});

		res.json(state);
	});
}
