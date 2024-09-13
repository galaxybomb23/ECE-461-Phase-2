import { test_url, url_type } from "./../src/url";
import { formatJSON, initJSON } from "../src/json";
import { exit } from "process";

// Mark the function as async to use await
async function main() {
    let link = process.argv[2]; // Get the link from command-line arguments
    console.log(`link provided: ${link}`); // Print the link

    if (link) {
        console.log(`Testing URL: ${link}\n`);

        try {
            // Await the result of test_url, assuming it's async
            const exists = await test_url(link);
            if (exists) {
                console.log('URL', link, 'exists\n');
            } else {
                console.log('URL', link, 'does not exist\n');
                return;
            }

            console.log("Creating data array from URLs...");
            let repo_JSON = initJSON();
            repo_JSON.URL = link;
            console.log("Data array created:", repo_JSON);

        } catch (error) {
            console.error('Error testing the URL:', error);
        }
    } else {
        console.error("No valid URLs found or an unexpected result from parse_urls\n");
    }
}

// Call the main function
main();

