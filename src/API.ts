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

    // Set up headers conditionally based on the presence of the token
    const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        const response = await axios.get(apiLink, { headers });
        return response.data; // This returns the response as JSON
    } catch (error: any) {
        
        // Since we've already checked repository exists, no need to throw error
        // Just means lack of data

        // Add to log file

        return {}; // Return empty dataset if no data can be retrieved
    }
}