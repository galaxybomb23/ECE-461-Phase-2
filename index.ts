import { test_url, parse_urls } from "./src/url";
import { initJSON } from "./src/json";
import { exit } from "process";
import {fetchJsonFromApi} from './src/API';

/**
 * Parses URLs from the given filename and validates them.
 * 
 * @param {string} filename - The path to the file containing URLs.
 * @returns {Promise<string[]>} A promise that resolves to an array of trimmed URLs.
 */
async function processUrls(filename: string): Promise<string[]> {
    const urls = parse_urls(filename);

    if (urls.length === 0) {
        console.error('URL file provided is empty.');
        exit(1);
    }

    return urls.map(url => url.trim()).filter(url => url !== ''); // Remove empty lines
}

/**
 * Validates a single URL by testing if it exists.
 * 
 * @param {string} url - The URL to test.
 * @returns {Promise<boolean>} A promise that resolves to true if the URL exists, false otherwise.
 */
async function validateUrl(url: string): Promise<boolean> {
    try {
        const exists = await test_url(url);
        if (!exists) {
            console.error('Invalid link:', url);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error testing the URL:', error);
        return false;
    }
}

/**
 * Initializes and returns a repository JSON object with the provided URL.
 * 
 * @param {string} url - The URL to be added to the repository JSON object.
 * @returns {Object} The initialized JSON object with the URL.
 */
function createRepoJson(url: string): object {
    let repo_JSON = initJSON(); // Initialize JSON object
    repo_JSON.URL = url; // Set the URL field
    return repo_JSON;
}

/**
 * Main function to coordinate the parsing, validation, and processing of URLs.
 * 
 * @returns {Promise<void>} A promise that resolves when the script finishes execution.
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2); // Get command-line arguments
    if (args.length < 1) {
        console.error("Usage: ./ run $URL_FILE");
        exit(1);
    }

    const filename = args[0]; // The filename provided as a command-line argument

    try {
        const urls = await processUrls(filename);

        for (const url of urls) {
            const isValid = await validateUrl(url);
            if (!isValid) {
                exit(1); // Exit if any URL is invalid
            }

            const repoJson = createRepoJson(url);
            // console.log(repoJson);   // To test output
        }

    } catch (error) {
        console.error('Error processing URLs:', error);
    }
}

// Call the main function
main();
