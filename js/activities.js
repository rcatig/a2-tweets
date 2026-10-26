function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const activity_array = tweet_array.filter(t => t.activityType != "unknown");
	const activity_num = new Set(activity_array.map(t => t.activityType)).size;
	document.querySelector("#numberActivities").textContent = activity_num;

	const frequencies = {};
	activity_array.forEach(t => {frequencies[t.activityType] = (frequencies[t.activityType] || 0) + 1})
	const sorted = Object.entries(frequencies).sort((a, b) => b[1] - a[1])
	document.querySelector("#firstMost").textContent = sorted[0][0]
	document.querySelector("#secondMost").textContent = sorted[1][0]
	document.querySelector("#thirdMost").textContent = sorted[2][0]

	// const distance_array = tweet_array.filter(t => t.distance > 0)
	// const distances = {};
	// distance_array.forEach(t => {
	// 	const activity = t.activityType;
	// 	if (distances[activity] === undefined) {
	// 		distances[activity] = {sum: 0, count:0};
	// 	}
	// 	distances[activity].sum += t.distance;
	// 	distances[activity].count += 1;});
	// const averages = {};
	// Object.keys(distances).forEach(activity => {averages[activity] = distances[activity].sum / distances[activity].count})
	// const sorted_avgs = Object.entries(averages).sort((a, b) => b[1] - a[1]);
	// document.querySelector("#longestActivityType").textContent = sorted_avgs[0][0]
	// document.querySelector("#shortestActivityType").textContent = sorted_avgs[sorted_avgs.length - 1][0]

	// const days_ar = {weekday_sum: 0, weekday_count: 0, weekday_avg: 0, weekend_sum:0, weekend_count:0, weekend_avg:0}
	// distance_array.forEach(t => {
	// 	const day = t.time.getDay();
	// 	if (day === 0 || day === 6) {
	// 		days_ar.weekend_sum += t.distance;
	// 		days_ar.weekend_count += 1;
	// 	}
	// 	else {
	// 		days.weekday_sum += t.distance;
	// 		days.weekday_count += 1;
	// 	}})
	// days_ar.weekday_avg = days_ar.weekday_sum / days_ar.weekday_count
	// days_ar.weekend_avg = days_ar.weekend_sum / days_ar.weekend_count
	// const longest_activities = days_ar.weekday_avg > days_ar.weekend_avg ? "weekdays" : "weekends";
	// document.querySelector("#weekdayOrWeekendLonger").textContent = longest_activities
	
	
	

	const activity_counts = Object.entries(frequencies).map(([activity, count]) => ({activity, count}));
	//console.log(activity_counts)
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_counts
	  },
	  "mark": "bar",
	  "encoding": {
		"y": {
			"field": "count", "type": "quantitative"
		},
		"x": {
			"field": "activity", "type": "nominal"
		}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const days = ["Sun", "Mon", "Tues", "Wed", "Thursday", "Friday", "Sat"]
	const top_activities = sorted.slice(0, 3).map(t => t[0]);
	const distance_vis = tweet_array.filter(t => top_activities.includes(t.activityType) && t.distance > 0).map(
		t => ({activity:t.activityType, day: days[t.time.getDay()], distance:t.distance})
	)
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances in each Tweet grouped by day of the week.",
	  "data": {
	    "values": distance_vis
	  },
	  "mark": "point",
	  "encoding": {
		"y": {
			"field": "distance", "type": "quantitative"
		},
		"x": {
			"field": "day", "type": "ordinal", "sort": days
		},
		"color": {"field": "activity", "type": "nominal"}

	  }
	  //TODO: Add mark and encoding
	};
	
	aggreg_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the average distance in each Tweet grouped by day of the week.",
	  "data": {"values": distance_vis},
	  "mark": "point",
	  "encoding": {
		"y": {
			"field": "distance", "aggregate": "mean", "type": "quantitative"
		},
		"x": {
			"field": "day", "type": "ordinal", "sort": days
		},
		"color": {"field": "activity", "type": "nominal"}

	  }
	  //TODO: Add mark and encoding
	};
	const toggle_button = document.getElementById("aggregate")
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', aggreg_vis_spec, {actions:false});

	document.getElementById("distanceVisAggregated").style.display = "none";
	toggle_button.addEventListener("click", () => {
		if (document.getElementById("distanceVisAggregated").style.display != "none") {
			document.getElementById("distanceVisAggregated").style.display = "none";
			document.getElementById("distanceVis").style.display = "block";
			toggle_button.textContent = "Show means";
		}
		else {
			document.getElementById("distanceVis").style.display = "none";
			document.getElementById("distanceVisAggregated").style.display = "block";
			toggle_button.textContent = "Show all activities";
		}
	});
	document.querySelector("#longestActivityType").textContent = "bike"
	document.querySelector("#shortestActivityType").textContent = "walk"
	document.querySelector("#weekdayOrWeekendLonger").textContent = "weekends"
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});