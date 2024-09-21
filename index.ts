import { exit } from "process";
import { get_valid_urls, url_type } from "./src/url";
import { get_metrics } from "./src/metrics/getMetrics";
import * as readline from 'readline';
import { getNodeJsAPILink } from "./src/nodejs_data";
import { formatJSON, initJSON } from "./src/json";
import{ getTimestampWithThreeDecimalPlaces } from "./src/metrics/getLatency";

async function main() {
    let args = process.argv.slice(2);

    if (args.length != 1) {     // Check for invalid number of arguments
        // TODO: Add log
        exit(1);
    }

    let filename = args[0];

    let valid_urls = await get_valid_urls(filename);

    let repo_stats = [];
    // Check if linke is NPM, convert to github
    for (let i = 0; i < valid_urls.length; i++) {
        
        repo_stats.push(await get_metrics(valid_urls[i]));
    }
    for (let i = 0; i < repo_stats.length; i++) {
        console.log(repo_stats[i]);
    }
    // console.log(repo_stats);
}




main();