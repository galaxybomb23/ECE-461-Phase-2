import { exit } from "process";
import { get_valid_urls, url_type } from "./url";
import { get_metrics } from "./metrics/getMetrics";
import { logMessage } from './log_file';

async function main() {
    logMessage('main - Start', ['Starting the main function.', 'Processing command line arguments.']);
    let args = process.argv.slice(2);
    logMessage('main - Arguments', [`Arguments received: ${JSON.stringify(args)}`, 'Checking if the number of arguments is correct.']);

    if (args.length !== 1) { // Check for invalid number of arguments
        logMessage('main - Invalid Arguments', ['Invalid number of arguments provided.', `Arguments length: ${args.length}`]);
        exit(1);
    }

    let filename = args[0];
    logMessage('main - Filename', [`Filename received: ${filename}`, 'Proceeding to fetch valid URLs.']);

    logMessage('main - Fetching Valid URLs', ['Fetching valid URLs from the provided filename.', 'Awaiting results from get_valid_urls.']);
    let valid_urls = await get_valid_urls(filename);
    logMessage('main - Valid URLs', [`Valid URLs fetched: ${JSON.stringify(valid_urls)}`, 'Proceeding to gather metrics for each valid URL.']);

    let repo_stats = [];

    for (let i = 0; i < valid_urls.length; i++) {
        logMessage('main - Processing URL', [`Processing URL: ${valid_urls[i]}`, 'Awaiting metrics retrieval.']);
        repo_stats.push(await get_metrics(valid_urls[i]));
        logMessage('main - Metrics Retrieved', [`Metrics retrieved for URL: ${valid_urls[i]}`, 'Storing metrics in repository stats.']);
    }


    for (let i = 0; i < repo_stats.length; i++) {
        logMessage('main - Outputting Stats', [`Outputting stats for repository: ${repo_stats[i]}`, 'Printing metrics to console.']);
        console.log(repo_stats[i]);
    }

    logMessage('main - End', ['Main function completed successfully.', 'Exiting the application.']);
}

main();