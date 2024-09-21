import * as fs from 'fs';
import { exit } from 'process';

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
    try {    // Try to connect to site, return true if the response is ok
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {    // If unable to connect to site, return false
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
    // Define the regex pattern to match specific URLs
    let regex = new RegExp("(github|npmjs)\\.com", "i");
    let match = regex.exec(url);
    
    if (match) {
        return match[1];  // Return the captured group (github or npmjs)
    }

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
    // Exit 1 (for error) if file does not exist
    if (!fs.existsSync(filename)) {
        // Add log
      exit(1);
    }
  
    const file_content = fs.readFileSync(filename, 'utf-8'); // Read file content
  
    // Return an empty array if the file content is empty
    if (!file_content) {
      return [];
    }
  
    return file_content.split('\n'); // Return array of URLs
}


export async function get_valid_urls(filename: string): Promise<string[]> {
    let args = process.argv.slice(2);

    if (args.length != 1) {     // Check for invalid number of arguments
        // TODO: Add log
        exit(1);
    }

    
    let url_array = parse_urls(filename);

    let valid_urls = [];

    for(let i = 0; i < url_array.length; i++){
        try{
            if(await test_url(url_array[i])){
                valid_urls.push(url_array[i]);
            }
            else{
                // Log that URL does not work
            }
        } catch (error) {
            // Log error
            exit(1);
        }
    }

    return(valid_urls);
}