import request from 'sync-request';
import { METHODS } from "http";

/**
 * Tests if a URL is reachable by making a synchronous HEAD request.
 * @param {string} url - The URL to test.
 * @returns {boolean} `true` if the URL is reachable (status code 200-399), otherwise `false`.
 */
export function test_url(url: string): boolean {
    try {   // Try to connect to site, return true if possible
        const response = request('HEAD', url);  // Retrieve head data from site
        return response.statusCode >= 200 && response.statusCode < 400;
    } catch (error) {   // If unable to connect to site, return false
        return false;
    }
}

/**
 * Asynchronously tests if a URL is reachable by making a HEAD request using `fetch`.
 * @param {string} url - The URL to test.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the URL is reachable, otherwise `false`.
 */
export async function async_test_url(url: string): Promise<boolean> {
    try{    // Try to connect to site, return the response is ok if possible
        const response = await fetch(url, {method: 'HEAD',});
        // console.log(response);   // View Response (For Testing Purposes)
        return(response.ok);
    } catch(error) {    // If unable to connect to site, return false
        return false;
    }
}
