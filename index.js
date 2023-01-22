const express = require("express");
const {getParameterObj} = require("./lib/utils.js");
const {Memes} = require("./lib/memes.js");
const {Reddit} = require("./lib/reddit.js");
const cors = require("cors");
const packageJSON = require("./package.json");

const app = express();
const port = process.env.PORT || 4000;

app.use(
	cors({
		origin: "*",
	})
);

app.use("/favicon.ico", express.static("public/images/icon.png"));
app.get(
	"/memes/random",
	(req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"X-Requested-With,content-type"
		);
		res.setHeader("Access-Control-Allow-Credentials", true);

		const parameters = getParameterObj(req.query);
		const meme = new Memes(parameters);
		meme.getRendomMemes((data)=>{
			res.status(200).send(data);
		});
		
	},
	cors()
);
app.get(
	"/memes",
	(req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"X-Requested-With,content-type"
		);
		res.setHeader("Access-Control-Allow-Credentials", true);

		var send = false;
		var parameters = getParameterObj(req.query);
		var meme = new Memes(parameters);

		meme.getMultipleSubreddits((data) => {
			if (send) return;
			send = true;
			res.status(200).send(data);
		}, parameters.lastIDs);
	},
	cors()
);

app.get("/reddit/u/:user", (req, res) => {
	if (req.params.user) {
		var user = req.params.user;

		Reddit.getUserInfo(user).then((data) => {
			res.send({ success: true, data: data });
		});
	} else {
		res.send({
			success: false,
			error: "No user specified!",
		});
	}
});

app.get("/", (req, res) => {
	var repoUrl = packageJSON.repository.url.startsWith("git+")
		? packageJSON.repository.url.slice(4)
		: packageJSON.repository.url;
	res.redirect(repoUrl);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
