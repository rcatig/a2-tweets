function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	completed = tweet_array.filter(t => t.source === "completed_event");
	written_tweets = completed.filter(t => t.written);
}

function addEventHandlerForSearch() {
	const text_filter = document.getElementById("textFilter");
	const tweet_table = document.getElementById("tweetTable");

	text_filter.addEventListener("input", function() {
		const query = this.value.toLowerCase().trim();
		if (query.length === 0) {
				tweet_table.innerHTML = "";
				document.getElementById("searchCount").textContent = "0";
				document.getElementById("searchText").textContent = "";
				return;
			};
		let match_count = 0;
		let tweet_html = "";
		written_tweets.forEach(tweet => { // Checks if user written tweet includes the query. Increases match count by 1 and fetches HTML table content.
			const tweet_text = tweet.writtenText.toLowerCase();

			if (tweet_text.includes(query)) {
				match_count += 1;
				tweet_html += tweet.getHTMLTableRow(match_count)
			}
			else { // If there is no query in the table, do nothing.
			}
		});
		
		tweet_table.innerHTML = tweet_html;
		document.getElementById("searchCount").textContent = match_count;
		document.getElementById("searchText").textContent = this.value;

	}
)
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});