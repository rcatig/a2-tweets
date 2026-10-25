class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const t = this.text.toLowerCase();
        if (t.startsWith("just posted") || t.startsWith("just completed"))
            return "completed_event";
        else if (t.includes("live") || t.includes("right now"))
            return "live_event";
        else if (t.includes("achieved") || t.includes("goal"))
            return "achievement";
        else
            return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.text.includes(" - ");
    }

    get writtenText():string {
        if (this.source != "completed_event") {
            return "";
        }
        else if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        else {
            const stripped_text = this.text.replace(/https?:\/\/\S+/g, "").replace(/#runkeeper/gi, "")
            return stripped_text.slice(stripped_text.indexOf(" - ") + 3).trim();
        }
       
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}