function extract_post_id(sr, tempSubreddits, tempLastIds) {
	if (sr.includes(":")) {
		const split = sr.split(":");
		const p1 = split[0];
		const p2 = split[1];

		tempSubreddits.push(p1);
		tempLastIds[p1] = p2;
	} else {
		tempSubreddits.push(sr);
	}
}

function getParameterObj({subreddits,max,filter,time}) {
	let param = {};
	if (subreddits) {
		const tempLastIds = {};
		const tempSubreddits = [];

		if (subreddits.includes(",")) {
			subreddits = subreddits.split(",");
			subreddits.forEach((sr) => {
				extract_post_id(sr, tempSubreddits, tempLastIds);
			});
		} else {
			extract_post_id(subreddits, tempSubreddits, tempLastIds);
		}
		param.subreddits = tempSubreddits;
		param.lastIDs = tempLastIds;
	}
	param = {...param, filter, max, time }
	
	return param;
}

export default getParameterObj;
