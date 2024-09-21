import { getGitHubAPILink } from '../github_data';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';

/**
 * Calculates the Responsive Maintainer score based on the recency of updates.
 * If the package has been updated within the last 6 months, give a higher score.
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number; latency: number }>} The Responsive Maintainer score (0-1) and fetch latency.
 */
export async function calculateResponsiveMaintainer(URL: string): Promise<{ score: number, latency: number }> {
    const latency_start = getTimestampWithThreeDecimalPlaces();

    const API_link = getGitHubAPILink(URL);

    // Fetch repository data and issues data in one call
    const [repoData, issuesData] = await Promise.all([
        fetchJsonFromApi(API_link),
        fetchJsonFromApi(`${API_link}/issues?state=all`)
    ]);

    let openIssuesCount = 0;
    let closedIssuesCount = 0;
    
    for (const issue of issuesData) {
        if (issue.closed_at) {
            closedIssuesCount++;
        } else {
            openIssuesCount++;
        }
    }
    
    // If open_issues_count from repoData is available, use it
    openIssuesCount = repoData.open_issues_count || openIssuesCount;
    

    const ratio = closedIssuesCount > 0 ? openIssuesCount / closedIssuesCount : 0; // Avoid division by zero
    const score = parseFloat((1 / (1 + ratio)).toFixed(2));
    
    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));

    return { score, latency: latencyMs };
}

// // Sample Call
// async function main() {
//     const url = 'https://github.com/lodash/lodash'; // Replace with your desired URL
//     const { score, latency } = await calculateResponsiveMaintainer(url); // Calculate Responsive Maintainer score and latency
//     console.log(`Responsive Maintainer Score: ${score}`);
//     console.log(`Fetch Latency: ${latency} seconds`);
// }
// main();