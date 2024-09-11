import request from 'sync-request';
import { METHODS } from "http";

/**
 * Synchronously checks if a given URL is accessible by making a HEAD request.
 * Returns true if the status code is in the range 200-399, otherwise returns false.
 * Catches any errors in the process and returns false.
 *
 * @export
 * @param {string} url - The URL to test for accessibility.
 * @returns {boolean} - Returns true if the URL is accessible, otherwise false.
 */
export function test_url(url: string): boolean {
    try {   // Try to connect to site, return true if response status is 200-399
        const response = request('HEAD', url);  // Retrieve head data from site
        return response.statusCode >= 200 && response.statusCode < 400;
    } catch (error) {   // If unable to connect to site, return false
        return false;
    }
}

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
export async function async_test_url(url: string): Promise<boolean> {
    try {    // Try to connect to site, return true if the response is ok
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {    // If unable to connect to site, return false
        return false;
    }
}
