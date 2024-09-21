import { getGitHubAPILink } from '../github_data';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';
import { logMessage } from './../log_file';

/**
 * Calculates the Correctness score based on various repository factors such as open issues, closed pull requests, and merge rates.
 * Fetches data in parallel to speed up the process.
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number; latency: number; }>} The Correctness score (0-1) and fetch latency.
 */
export async function calculateCorrectness(URL: string): Promise<{ score: number; latency: number; }> {
    const latency_start = getTimestampWithThreeDecimalPlaces();
    logMessage('calculateCorrectness', ['Starting correctness calculation.', `URL: ${URL}`]);

    const API_link = getGitHubAPILink(URL);
    logMessage('calculateCorrectness', ['API link constructed.', `API link: ${API_link}`]);

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
    logMessage('calculateCorrectness', ['Data fetched in parallel.', 'Fetched repository, pull request, and issue data.']);

    // Calculate useful metrics
    const totalIssues = closedIssuesData.length + openIssuesData.length;
    const totalPullRequests = closedPullData.length + openPullData.length;
    logMessage('calculateCorrectness', ['Calculating metrics.', `Total Issues: ${totalIssues}, Total Pull Requests: ${totalPullRequests}`]);

    const issueResolutionRate = totalIssues ? closedIssuesData.length / totalIssues : 1;
    const pullRequestMergeRate = totalPullRequests ? closedPullData.length / totalPullRequests : 1;

    const openIssuesCount = repoData.open_issues_count || openIssuesData.length;
    logMessage('calculateCorrectness', ['Metrics calculated.', `Issue Resolution Rate: ${issueResolutionRate}, Pull Request Merge Rate: ${pullRequestMergeRate}`]);

    // Define a reasonable maximum number of issues and pull requests
    const MAX_ISSUES = 150;
    const MAX_PULL_REQUESTS = 300;

    // Normalize the open issues and pull requests to create a score
    const issueScore = 1 - Math.min(openIssuesCount / MAX_ISSUES, 1);
    const pullRequestScore = Math.min(closedPullData.length / MAX_PULL_REQUESTS, 1);
    logMessage('calculateCorrectness', ['Normalizing scores.', `Issue Score: ${issueScore}, Pull Request Score: ${pullRequestScore}`]);

    // Combine the metrics: you can weight them according to their importance
    const combinedScore = 0.4 * issueScore + 0.3 * pullRequestScore + 0.15 * issueResolutionRate + 0.15 * pullRequestMergeRate;

    // Round the score to 1 decimal place
    const roundedScore = parseFloat(combinedScore.toFixed(1));
    logMessage('calculateCorrectness', ['Combined score calculated.', `Rounded Score: ${roundedScore}`]);

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
    logMessage('calculateCorrectness', ['Latency calculated.', `Latency: ${latencyMs} ms`]);

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