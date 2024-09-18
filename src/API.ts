import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Fetches JSON data from a given API endpoint.
 *
 * This function performs an HTTP GET request to the specified `apiLink` and returns the response data in JSON format.
 * If an error occurs during the request, it logs the error and rethrows it for further handling.
 *
 * @async
 * @param {string} apiLink - The URL of the API endpoint from which to fetch data.
 * @returns {Promise<any>} A promise that resolves to the JSON data from the API response.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export async function fetchJsonFromApi(apiLink: string): Promise<any> {
    // Get the token from environment variables
    const token = process.env.GITHUB_TOKEN;

    // Configure the request with the Authorization header
    const config = {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    try {
        const response = await axios.get(apiLink, config);
        return response.data; // This returns the response as JSON
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
}