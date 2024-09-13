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