const axios = require("axios");
const NodeCache = require("node-cache");
const Reddit = require("./reddit.js");

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class Memes {
	constructor(config = {}) {
		// Create an array of one element if parameter is passed as string
		if (typeof config.subreddits === "string") {
			config.subreddits = [config.subreddits];
		}

		// Set maxiuum memes
		this.max = config.max ? parseInt(config.max) : 1;

		var availableFilters = ["top", "hot", "new", "controversial", "rising"];
		const availableTimeFrame = ["hour", "day", "week", "month", "year", "all"]

		this.filter = availableFilters.includes(config.filter)
			? config.filter
			: false;

		this.time = availableTimeFrame.includes(config.time)
			? config.time
			: "month";

		// Set the subreddit
		this.subreddits = config.subreddits ?? [
			"memes",
			"dankmemes",
			"wholesomememes",
		];

		this.authortDetails = config.author ?
			config.author == "all" ?? false
			: false

		this.query_params = {
			subreddits: this.subreddits,
			max: this.max,
			filter: this.filter,
			time: this.time,
			time: this.time,
			authortDetails: this.authortDetails,
		}

	}

	getRendomMemes(cb) {

		const cache_key = JSON.stringify(this.query_params) + "_getRendomMemes";
		let value = cache.get(cache_key);
		if (value !== undefined) {
			this.process_rendom_memes(value, cb, cache_key, true)
		} else {

			this.getMultipleSubreddits((data) => {
				this.process_rendom_memes(data, cb, cache_key, false);
			});
		}

	}

	process_rendom_memes(data, cb, cache_key, is_cache) {
		let datas = [];

		if (is_cache == false) {
			const subreddits = data.data;
			Object.keys(subreddits).forEach(sub => {
				datas = [...datas, ...subreddits[sub]];
			});
			cache.set(cache_key, datas, 10000)
		} else {
			datas = data;
		}

		const idx = datas.length > 1 ?
			(Math.random() * 100) % (datas.length - 1)
			: datas.length;
		this._callback(cb, datas[parseInt(idx)]);
	}

	getMultipleSubreddits(callback, lastIds = {}) {
		const cache_key = JSON.stringify(this.query_params) + "_getMultipleSubreddits";
		if (cache.get(cache_key)) {
			this._callback(callback, cache.get(cache_key))
		}
		var result = {};

		console.log("Fetching data from subreddits: ", this.subreddits);
		this.subreddits.forEach((subreddit, index) => {
			var last = lastIds[subreddit] ?? false;
			var processedRedditcount = index + 1;

			this.getSubreddit(
				subreddit,
				(data) => {
					result[subreddit] = data;
					if (processedRedditcount === this.subreddits.length) {
						var finalResult = {
							success: true,
							data: result,
							properties: {
								subreddits: this.subreddits,
								max: this.max,
								filter: this.filter,
								time: this.time,
							},
						};
						cache.set(cache_key, finalResult, 10000)
						this._callback(callback, finalResult);
					}
				},
				last
			);
		});
	}

	getSubreddit(subreddit, callback, lastid) {
		var memes = [];
		var url = this._getApiUrl(subreddit, lastid);

		this._fetchData(url, (result) => {
			var data = result.data;
			var processeMemeCount = 0;

			if (result.success) {
				data.map(async (meme) => {
					processeMemeCount++;
					meme = meme.data;

					if (!meme.url.endsWith(".jpg") || meme.url.endsWith(".png") || meme.url.endsWith(".gif")) {
						return;
					}
					var memeResult = {
						id: meme.id,
						title: meme.title,
						url: meme.url,
						subreddit: meme.subreddit,
						ups: meme.ups,
						downs: meme.downs,
						score: meme.score,
						created: meme.created,
						NSFW: meme.over_18,
						spoiler: meme.spoiler,
						post_url: "https://www.reddit.com" + meme.permalink,
					};

					if (this.authortDetails) {
						let authorResult = await Reddit.getUserInfo(meme.author);

						authorResult = authorResult.data;
						var sr = authorResult.subreddit || {};
						var name = sr.title;
						var profile = sr.icon_img;
						var id = authorResult.name;
						var description =
							sr.public_description ?? "I love reddit!";

						memeResult.author = {
							name,
							profile,
							id,
							description,
						};
					}


					memes.push(memeResult);
					if (processeMemeCount === data.length) {
						this._callback(callback, memes);
					}

				});
			}
		});
	}

	_getAuthorInfo(author, callback) {
		this._fetchData(
			`https://www.reddit.com/user/${author}/about.json`,
			(result) => {
				if (result.error === 404) {
					this._callback(callback, {
						success: false,
						error: "User not found!",
					});
				} else {
					this._callback(callback, {
						success: true,
						data: result.data,
					});
				}
			}
		);
	}

	_fetchData(url, cb) {
		axios
			.get(url)
			.then((response) => {
				const data = response.data.data.children;
				if (data.length === 0) {
					cb({
						success: false,
						data: "No such subreddit, or it may be private!",
					});
				} else {
					cb({
						success: true,
						data: data,
					});
				}
			})
			.catch((error) => console.log(error));
	}

	_callback(e, t) {
		var data = t ?? {};
		const cb = e ?? false;
		if (typeof cb === "function") {
			cb(data);
		}
	}

	_getApiUrl(subreddit, lId) {
		var filter = this.filter;

		if (subreddit) {
			var params = {};

			if (lId) {
				params.after = lId;
			}
			params.limit = this.max;

			params.t = this.time;

			const sp = new URLSearchParams(params);

			var url = `https://www.reddit.com/r/${subreddit}${filter ? `/${filter}` : ""
				}.json?${sp}`;

			console.log("Fetching data from URL: ", url);
			return url;
		} else {
			return `https://www.reddit.com/r/memes.json?${this.max}`;
		}
	}
}


module.exports = {
	Memes
}
