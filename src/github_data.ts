import * as sqlite3 from 'sqlite3';
import { fetchJsonFromApi } from "./API";

/**
 * Generates a GitHub API URL based on the provided repository URL and endpoint.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., https://github.com/owner/repo).
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches').
 * @returns {string} The GitHub API URL for the specified endpoint.
 */
export function getGitHubAPILink(url: string, endpoint: string = ''): string {
    // Split the URL to extract the repository owner and name.
    let urlParts = url.split('/');  // Split link into parts
    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    let repo = urlParts[urlParts.length - 1];   // Isolate repository name

    return `https://api.github.com/repos/${owner}/${repo}${endpoint ? '/' + endpoint : ''}`;    // Return API link with endpoint
}

/**
 * Extracts contribution counts from the GitHub API response data.
 *
 * @param {any[]} data - The response data from the GitHub API, where each item represents a contributor.
 * @returns {number[]} An array of contribution counts, one for each contributor.
 */
export function getContributionCounts(data: any[]): number[] {
    // Initialize an empty array to store contribution counts.
    let contributionCounts: number[] = [];

    // Iterate over each item in the response data.
    for (const item of data) {
        // Check if the 'contributions' field exists and is a number.
        if (typeof item.contributions === 'number') {
            contributionCounts.push(item.contributions);
        }
    }

    // Return the array of contribution counts.
    return contributionCounts;
}