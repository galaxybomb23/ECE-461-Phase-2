// Takes in a file
import * as fs from 'fs';


/**
 * Parses a file containing URLs and returns them as an array of strings.
 * If the file does not exist, returns 0.
 * 
 * @param {string} filename - The path to the file containing the URLs.
 * @returns {string[] | number} An array of URLs if the file exists, or `0` if the file does not exist.
 */
export function parse_urls(filename: string): string[] | number{

    // Return 0 (for error) if file does not exist
    if(!fs.existsSync(filename)){
        return 0;
    }

    const file_content = fs.readFileSync(filename, 'utf-8');    // Read file content

    return(file_content.split('\n'));   // Return array of URLs
}