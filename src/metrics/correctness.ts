import { getGitHubAPILink } from '../github_data';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';

/**
 * Calculates the Correctness score based on various repository factors such as open issues, closed pull requests, and merge rates.
 * Fetches data in parallel to speed up the process.
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number; latency: number; }>} The Correctness score (0-1) and fetch latency.
 */
export async function calculateCorrectness(URL: string): Promise<{ score: number; latency: number; }> {
     // TODO: Add logfile handling
    const latency_start = getTimestampWithThreeDecimalPlaces();
     // TODO: Add logfile handling

     // TODO: Add logfile handling
    const API_link = getGitHubAPILink(URL);
     // TODO: Add logfile handling


     // TODO: Add logfile handling
    // Fetch the data in parallel
    const [
        repoData, 
        closedPullData, 
        openPullData, 
        closedIssuesData, 
        openIssuesData
    ] = await Promise.all([
        fetchJsonFromApi(API_link),                          // Fetch repository data (open issues count)
        fetchJsonFromApi(API_link + '/pulls?state=closed'),  // Fetch closed pull requests
        fetchJsonFromApi(API_link + '/pulls?state=open'),    // Fetch open pull requests
        fetchJsonFromApi(API_link + '/issues?state=closed'), // Fetch closed issues
        fetchJsonFromApi(API_link + '/issues?state=open')    // Fetch open issues
    ]);
     // TODO: Add logfile handling

    // TODO: Add logfile handling
    // Calculate useful metrics
    const totalIssues = closedIssuesData.length + openIssuesData.length;
    const totalPullRequests = closedPullData.length + openPullData.length;

    const issueResolutionRate = totalIssues ? closedIssuesData.length / totalIssues : 1;
    const pullRequestMergeRate = totalPullRequests ? closedPullData.length / totalPullRequests : 1;

    const openIssuesCount = repoData.open_issues_count || openIssuesData.length;
     // TODO: Add logfile handling

    // Define a reasonable maximum number of issues and pull requests
    const MAX_ISSUES = 150;
    const MAX_PULL_REQUESTS = 300;

     // TODO: Add logfile handling
    // Normalize the open issues and pull requests to create a score
    const issueScore = 1 - Math.min(openIssuesCount / MAX_ISSUES, 1);
    const pullRequestScore = Math.min(closedPullData.length / MAX_PULL_REQUESTS, 1);
     // TODO: Add logfile handling

     // TODO: Add logfile handling
    // Combine the metrics: you can weight them according to their importance
    const combinedScore = 0.4 * issueScore + 0.3 * pullRequestScore + 0.15 * issueResolutionRate + 0.15 * pullRequestMergeRate;

    // Round the score to 1 decimal place
    const roundedScore = parseFloat(combinedScore.toFixed(1));

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
     // TODO: Add logfile handling

    return { score: roundedScore, latency: latencyMs };
}

// // Sample Call
// async function main(){
//     const url = 'https://github.com/lodash/lodash'; // Replace with your desired URL
//     const { score: correctnessScore, latency } = await calculateCorrectness(url); // Calculate Correctness score and latency
//     console.log(`Correctness Score: ${correctnessScore}`);
//     console.log(`Fetch Latency: ${latency} ms`);
// }
// main();