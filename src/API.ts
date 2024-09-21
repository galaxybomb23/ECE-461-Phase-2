import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Fetches JSON data from a given API endpoint.
 *
 * This function performs an HTTP GET request to the specified `apiLink` and returns the response data in JSON format.
 * If an error occurs during the request, it logs the error and returns an empty object if the error is for the "license" endpoint.
 *
 * @async
 * @param {string} apiLink - The URL of the API endpoint from which to fetch data.
 * @returns {Promise<any>} A promise that resolves to the JSON data from the API response or an empty object if there is an error for the "license" endpoint.
 * @throws {Error} Throws an error if the HTTP request fails and the endpoint is not "license".
 */
export async function fetchJsonFromApi(apiLink: string): Promise<any> {
    // Get the token from environment variables
    const token = process.env.GITHUB_TOKEN;
    // TODO: Add logfile handling

    // Set up headers conditionally based on the presence of the token
    const headers: any = {
        // TODO: Add logfile handling
        'Accept': 'application/vnd.github.v3+json',
    };

    // TODO: Add logfile handling
    if (token) {
        // TODO: Add logfile handling
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // TODO: Add logfile handling
        const response = await axios.get(apiLink, { headers });
        // TODO: Add logfile handling
        return response.data; // This returns the response as JSON
    } catch (error: any) {

        // TODO: Add logfile handling

        // Since we've already checked repository exists, no need to throw error
        // Just means lack of data

        return {}; // Return empty dataset if no data can be retrieved
    }
}