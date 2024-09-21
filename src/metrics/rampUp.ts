import axios from 'axios';
import { getGitHubAPILink } from '../github_data';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';

/**
 * Calculates the RampUp score and fetch latency for GitHub repositories.
 * The smaller the repository size, the higher the score.
 * 
 * @param {string} repoURL - The GitHub repository URL.
 * @returns {Promise<{ score: number, latency: number }>} The RampUp score and latency.
 */
export async function calculateRampUp(repoURL: string): Promise<{ score: number, latency: number }> {
     // TODO: Add logfile handling
    const latency_start = getTimestampWithThreeDecimalPlaces();
    const MAX_SIZE_KB = 50000; // Arbitrary maximum repository size in KB (50MB)
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // GitHub API URL for repository information
    const apiLink = getGitHubAPILink(repoURL);
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // Fetch repository data from GitHub
    let repoData;
    try {
        repoData = await fetchJsonFromApi(apiLink);
    } catch (error) {
        throw new Error('Error fetching repository data from GitHub');
    }
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // Calculate repo size in KB
    const sizeInKb = repoData.size || 0;
    if (sizeInKb <= 0) {
        console.warn('GitHub repository size information not available or invalid. Using default size of 0.');
    }
     // TODO: Add logfile handling

     // TODO: Add logfile handling
    // Calculate the RampUp score
    const score = parseFloat((1 - Math.min(sizeInKb / MAX_SIZE_KB, 1)).toFixed(1)); // Ensure score is between 0 and 1
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
     // TODO: Add logfile handling
    return { score, latency: latencyMs }; // Return score and latency in a readable format
}

// Sample Call
// async function main() {
//     const repoURL = 'https://github.com/lodash/lodash'; // Replace with the desired GitHub repository URL
//     const { score, latency } = await calculateRampUp(repoURL); // Calculate RampUp score and latency
//     console.log(`RampUp Score: ${score}`);
//     console.log(`Fetch Latency: ${latency}`);
// }
// main();