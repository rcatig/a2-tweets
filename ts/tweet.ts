class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
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

    get strip():string{
        return this.text.replace(/https?:\/\/\S+/g, "").replace(/#runkeeper/gi, "").trim()
    }

    get writtenText():string {
        if (this.source != "completed_event") {
            return "";
        }
        else if(!this.written) {
            return "";
        }
        else {
            const stripped_text = this.strip
            return stripped_text.slice(stripped_text.indexOf(" - ") + 3);
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        else {
            const substr = this.strip.split(" ");
            if (substr.includes("km") || substr.includes("mi")) {
                return substr[5].toLowerCase();
            }
            else {
                return substr[3].toLowerCase();
            }
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        else {
            const substr = this.strip.split(" ");
            const value = Number(substr[3])
            if (isNaN(value)) {
                return 0;
            }
            else if (substr.includes("km")) {
                return value / 1.609
            }
            else if (substr.includes("mi")) {
                return value
            }
            else {
                return 0;
            }
        }
        //TODO: prase the distance from the text of the tweet
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let url = ""
        const match = this.text.match(/https?:\/\/\S+/)
        if (match) {
            url = `<a href="${match[0]}" target="_blank">${match[0]}</a>`
            console.log(url)
        }
        return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${this.writtenText} ${url}</td></tr>`;
    }
}