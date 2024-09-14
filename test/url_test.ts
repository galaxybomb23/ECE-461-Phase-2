import { test_url, url_type, parse_urls } from "./../src/url";
import { formatJSON, initJSON } from "../src/json";
import { exit } from "process";

// Mark the function as async to use await
async function main() {
    const filename = 'test/data/sample_urls.txt'; // Path to the file with URLs
    console.log(`Parsing file: ${filename}`);

    try {
        // Parse URLs from the file
        const urls = parse_urls(filename);

        if (urls.length === 0) {
            console.error('File not found or error reading file.');
            return;
        }

        // Ensure `urls` is an array before trying to access properties or use it in a loop
        if (Array.isArray(urls)) {
            console.log(`Found ${urls.length} URL(s).`);

            for (const url of urls) {
                const trimmedUrl = url.trim();
                if (trimmedUrl === '') continue; // Skip empty lines

                console.log(`Testing URL: ${trimmedUrl}\n`);

                try {
                    const exists = await test_url(trimmedUrl);
                    if (exists) {
                        console.log('URL', trimmedUrl, 'exists\n');
                    } else {
                        console.log('URL', trimmedUrl, 'does not exist\n');
                    }

                    // Create JSON data for each URL
                    console.log("Creating data array from URL...");
                    let repo_JSON = initJSON();
                    repo_JSON.URL = trimmedUrl;
                    console.log("Data array created:", repo_JSON);

                } catch (error) {
                    console.error('Error testing the URL:', error);
                }
            }
        } else {
            console.error('Unexpected result from parse_urls.');
        }

    } catch (error) {
        console.error('Error parsing URLs from file:', error);
    }
}

// Call the main function
main();