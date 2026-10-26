function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const activity_array = tweet_array.filter(t => t.activityType != "unknown");
	const activity_num = new Set(activity_array.map(t => t.activityType)).size;
	document.querySelector("#numberActivities").textContent = activity_num;

	const frequencies = {};
	activity_array.forEach(t => {frequencies[t.activityType] = (frequencies[t.activityType] || 0) + 1}); // Count the number of tweets for each activity
	const sorted = Object.entries(frequencies).sort((a, b) => b[1] - a[1]); // Sort from most frequent to least frequent
	document.querySelector("#firstMost").textContent = sorted[0][0];
	document.querySelector("#secondMost").textContent = sorted[1][0];
	document.querySelector("#thirdMost").textContent = sorted[2][0];

	const activity_counts = Object.entries(frequencies).map(([activity, count]) => ({activity, count})); // Create new object for Vega-Lite to read.
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_counts
	  },
	  "mark": "bar",
	  "encoding": {
		"y": {"field": "count", "type": "quantitative"},
		"x": {"field": "activity", "type": "nominal"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const days = ["Sun", "Mon", "Tues", "Wed", "Thursday", "Friday", "Sat"];
	const top_activities = sorted.slice(0, 3).map(t => t[0]);
	const distance_vis = tweet_array.filter(t => top_activities.includes(t.activityType) && t.distance > 0).map(
		t => ({activity:t.activityType, day: days[t.time.getDay()], distance:t.distance})); // Format new object to have activity, date, and distance for each tweet.
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances in each Tweet grouped by day of the week.",
	  "data": {
	    "values": distance_vis
	  },
	  "mark": "point",
	  "encoding": {
		"y": {"field": "distance", "type": "quantitative"},
		"x": {"field": "day", "type": "ordinal", "sort": days},
		"color": {"field": "activity", "type": "nominal"}
	  }
	};
	
	aggreg_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the average distance in each Tweet grouped by day of the week.",
	  "data": {"values": distance_vis},
	  "mark": "point",
	  "encoding": {
		"y": {"field": "distance", "aggregate": "mean", "type": "quantitative"},
		"x": {"field": "day", "type": "ordinal", "sort": days},
		"color": {"field": "activity", "type": "nominal"}
	  }
	};

	const toggle_button = document.getElementById("aggregate");
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', aggreg_vis_spec, {actions:false});

	document.getElementById("distanceVisAggregated").style.display = "none";
	toggle_button.addEventListener("click", () => {
		if (document.getElementById("distanceVisAggregated").style.display != "none") { // Checks if activity graph is showing
			document.getElementById("distanceVisAggregated").style.display = "none";
			document.getElementById("distanceVis").style.display = "block";
			toggle_button.textContent = "Show means";
		}
		else { // Checks if mean graph is showing
			document.getElementById("distanceVis").style.display = "none";
			document.getElementById("distanceVisAggregated").style.display = "block";
			toggle_button.textContent = "Show all activities";
		}
	});
	document.querySelector("#longestActivityType").textContent = "bike";
	document.querySelector("#shortestActivityType").textContent = "walk";
	document.querySelector("#weekdayOrWeekendLonger").textContent = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});