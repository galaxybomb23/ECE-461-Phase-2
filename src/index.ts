import { exit } from "process";
import { get_valid_urls, url_type } from "./url";
import { get_metrics } from "./metrics/getMetrics";

async function main() {
    // TODO: Add logfile handling
    let args = process.argv.slice(2);
    // TODO: Add logfile handling

    if (args.length != 1) {     // Check for invalid number of arguments
        // TODO: Add logfile handling
        exit(1);
    }
    // TODO: Add logfile handling

    let filename = args[0];
    // TODO: Add logfile handling

    // TODO: Add logfile handling
    let valid_urls = await get_valid_urls(filename);
    // TODO: Add logfile handling

    let repo_stats = [];

    // TODO: Add logfile handling
    for (let i = 0; i < valid_urls.length; i++) {
        // TODO: Add logfile handling
        repo_stats.push(await get_metrics(valid_urls[i]));
    }

    // TODO: Add logfile handling
    for (let i = 0; i < repo_stats.length; i++) {
        // TODO: Add logfile handling
        console.log(repo_stats[i]);
    }
}




main();
exit(0);