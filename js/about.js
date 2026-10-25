function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const times = tweet_array.map(t => t.time);
	const first_date = times.reduce((first, current) => {
		return Date.parse(current) < Date.parse(first) ? current:first});
	const last_date = times.reduce((last, current) => {
		return Date.parse(current) > Date.parse(last) ? current:last});
	
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	const form_first_date = first_date.toLocaleDateString("en-US", options);
	const form_last_date = last_date.toLocaleDateString("en-US", options);
	document.querySelector("#firstDate").textContent = form_first_date;
	document.querySelector("#lastDate").textContent = form_last_date;

	const tweet_num = tweet_array.length;
	document.querySelector("#numberTweets").textContent = tweet_num;

	const completed = tweet_array.filter(t => t.source === "completed_event");
	const completed_num = completed.length;
	document.querySelectorAll(".completedEvents").forEach(t => {t.textContent = completed_num});

	const completed_pct = math.format((completed_num / tweet_num) * 100, { notation: 'fixed', precision: 2 }) + '%';
	document.querySelector(".completedEventsPct").textContent = completed_pct;

	const live_num = tweet_array.filter(t => t.source === "live_event").length;
	document.querySelector(".liveEvents").textContent = live_num;

	const live_pct = math.format((live_num / tweet_num) * 100, { notation: 'fixed', precision: 2 }) + '%';
	document.querySelector(".liveEventsPct").textContent = live_pct;

	const achieve_num = tweet_array.filter(t => t.source === "achievement").length;
	document.querySelector(".achievements").textContent = achieve_num;

	const achieve_pct = math.format((achieve_num / tweet_num) * 100, { notation: 'fixed', precision: 2 }) + '%';
	document.querySelector(".achievementsPct").textContent = achieve_pct;

	const miscell_num = tweet_array.filter(t => t.source === "miscellaneous").length;
	document.querySelector(".miscellaneous").textContent = miscell_num;

	const miscell_pct = math.format((miscell_num / tweet_num) * 100, { notation: 'fixed', precision: 2 }) + '%';
	document.querySelector(".miscellaneousPct").textContent = miscell_pct;

	const written_num = completed.filter(t => t.written).length;
	document.querySelector(".written").textContent = written_num;
	const written_pct = math.format((written_num / completed_num) * 100, { notation: 'fixed', precision: 2 }) + '%';
	document.querySelector(".writtenPct").textContent = written_pct;

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});