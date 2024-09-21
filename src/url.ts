import * as fs from 'fs';
import { exit } from 'process';
import { logMessage } from './log_file';

/**
 * Checks if a given URL is accessible by making a HEAD request.
 * Returns true if the response is successful (status code in the range 200-299),
 * otherwise returns false. Catches any errors in the process and returns false.
 *
 * @export
 * @async
 * @param {string} url - The URL to test for accessibility.
 * @returns {Promise<boolean>} - A promise that resolves to true if the URL is accessible, otherwise false.
 */
export async function test_url(url: string): Promise<boolean> {
    try {
        logMessage('test_url', ['Checking URL accessibility.', `Testing URL: ${url}`]);
        const response = await fetch(url, { method: 'HEAD' });
        logMessage('test_url', ['URL accessibility check completed.', `Response OK: ${response.ok}`]);
        return response.ok;
    } catch (error) {
        logMessage('test_url', ['Error while checking URL accessibility.', `Error: ${error}`]);
        return false;
    }
}

/**
 * Determines the type of URL based on the domain.
 * If the URL contains "github.com" or "npmjs.com", it returns "github" or "npmjs" respectively, 
 * with the ".com" stripped. If neither is matched, it returns "other".
 *
 * @export
 * @param {string} url - The URL to evaluate.
 * @returns {string} - Returns "github" for GitHub URLs, "npmjs" for npmJS URLs, or "other" if neither.
 */
export function url_type(url: string): string {
    logMessage('url_type', ['Determining URL type.', `Evaluating URL: ${url}`]);
    
    let regex = new RegExp("(github|npmjs)\\.com", "i");
    let match = regex.exec(url);
    
    if (match) {
        logMessage('url_type', ['Match found for URL type.', `Matched type: ${match[1]}`]);
        return match[1];  // Return the captured group (github or npmjs)
    }

    logMessage('url_type', ['No match found for URL type.', 'Returning "other".']);
    return "other"; // Return "other" if no match
}

/**
 * Parses a file containing URLs and returns them as an array of strings.
 * If the file does not exist, returns 0.
 * 
 * @param {string} filename - The path to the file containing the URLs.
 * @returns {string[] | number} An array of URLs if the file exists, or `0` if the file does not exist.
 */
export function parse_urls(filename: string): string[] {
    if (!fs.existsSync(filename)) {
        logMessage('parse_urls', ['File does not exist.', `Filename: ${filename}`]);
        exit(1);
    }

    logMessage('parse_urls', ['File exists, reading content.', `Filename: ${filename}`]);
    const file_content = fs.readFileSync(filename, 'utf-8'); // Read file content

    if (!file_content) {
        logMessage('parse_urls', ['File content is empty.', 'Returning empty array.']);
        return [];
    }

    logMessage('parse_urls', ['Parsing URLs from file content.', `Content length: ${file_content.length}`]);
    return file_content.split('\n'); // Return array of URLs
}

export async function get_valid_urls(filename: string): Promise<string[]> {
    logMessage('get_valid_urls', ['Getting valid URLs from file.', `Filename: ${filename}`]);

    let args = process.argv.slice(2);
    if (args.length != 1) {     // Check for invalid number of arguments
        logMessage('get_valid_urls', ['Invalid number of arguments.', 'Exiting with error.']);
        exit(1);
    }

    let url_array = parse_urls(filename);
    let valid_urls = [];

    for (let i = 0; i < url_array.length; i++) {
        try {
            logMessage('get_valid_urls', ['Testing URL for validity.', `URL: ${url_array[i]}`]);
            if (await test_url(url_array[i])) {
                logMessage('get_valid_urls', ['Valid URL found.', `Adding URL: ${url_array[i]}`]);
                valid_urls.push(url_array[i]);
            } else {
                logMessage('get_valid_urls', ['Invalid URL found.', `URL: ${url_array[i]}`]);
            }
        } catch (error) {
            logMessage('get_valid_urls', ['Error processing URL.', `Error: ${error}`]);
            exit(1);
        }
    }

    logMessage('get_valid_urls', ['Returning valid URLs.', `Count: ${valid_urls.length}`]);
    return valid_urls;
}