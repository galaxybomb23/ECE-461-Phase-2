import { getGitHubAPILink } from "../githubData";
import { fetchJsonFromApi } from "../API";
import { getTimestampWithThreeDecimalPlaces } from "./getLatency";
import { logMessage } from '../logFile';

/**
 * Fetches the license data for a given GitHub repository URL and calculates a license score.
 * The score is 1 if a license is found, and 0 otherwise.
 * 
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number, latency: number }>} - An object containing the license score and the fetch latency in milliseconds.
 */
export async function getLicenseScore(URL: string): Promise<{ score: number, latency: number }> {
    logMessage('getLicenseScore', ['Starting license score calculation.', `URL: ${URL}`]);
    
    const latency_start = getTimestampWithThreeDecimalPlaces(); // Start timing the fetch
    logMessage('getLicenseScore', ['Latency tracking started.', `Start timestamp: ${latency_start}`]);

    // Construct the API link for fetching license data
    const API_link = getGitHubAPILink(URL, 'license'); // Adjust endpoint as needed
    logMessage('getLicenseScore', ['Constructed API link for license data.', `API link: ${API_link}`]);

    // Fetch the license data from the API
    const license_data = await fetchJsonFromApi(API_link);
    logMessage('getLicenseScore', ['License data fetched successfully.', `License data: ${JSON.stringify(license_data)}`]);

    // Calculate the license score based on the presence of license data
    let license_score = 0;
    if (license_data.license) {
        license_score = 1; // Score of 1 indicates a license is present
        logMessage('getLicenseScore', ['License score calculated.', `Score: ${license_score}`]);
    } else {
        logMessage('getLicenseScore', ['No license found.', 'Score remains 0.']);
    }

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(3));
    logMessage('getLicenseScore', ['Latency calculation complete.', `Latency: ${latencyMs} ms`]);

    return { score: license_score, latency: latencyMs }; // Return the score and latency
}