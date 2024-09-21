import * as sqlite3 from 'sqlite3';
import axios from 'axios';
import { fetchJsonFromApi } from "./API";
import { url_type } from './url';
import { extractLastIssuesUrlFromJson } from './json';

/**
 * Generates a GitHub API URL based on the provided repository URL and endpoint.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., https://github.com/owner/repo).
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches').
 * @returns {string} The GitHub API URL for the specified endpoint.
 */
export function getGitHubAPILink(url: string, endpoint: string = ''): string {
    // Split the URL to extract the repository owner and name.
    // TODO: Add logfile handling
    let urlParts = url.split('/');  // Split link into parts
    // TODO: Add logfile handling
    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    // TODO: Add logfile handling
    // TODO: Add logfile handling
    let repo = urlParts[urlParts.length - 1];   // Isolate repository name
    // TODO: Add logfile handling

    // Check if repo contains ".git" and remove it if necessary
    // TODO: Add logfile handling
    if (repo.endsWith('.git')) {
        // TODO: Add logfile handling
        repo = repo.slice(0, -4); // Remove the last 4 characters (".git")
        // TODO: Add logfile handling
    }

    // TODO: Add logfile handling
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
    // TODO: Add logfile handling
    let contributionCounts: number[] = [];

    // Iterate over each item in the response data.
    for (const item of data) {
        // TODO: Add logfile handling
        // Check if the 'contributions' field exists and is a number.
        if (typeof item.contributions === 'number') {
            // TODO: Add logfile handling
            contributionCounts.push(item.contributions);
        }
    }
    // TODO: Add logfile handling
    // Return the array of contribution counts.
    return contributionCounts;
}


/**
 * Fetches the number of open issues for a given GitHub repository.
 * @param {string} owner - The GitHub owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<number>} - The number of open issues.
//  */

async function fetchOpenIssuesCount(owner: string, repo: string): Promise<number> {
    // TODO: Add logfile handling
    let page = 1;
    // TODO: Add logfile handling
    let totalOpenIssues = 0;
    // TODO: Add logfile handling
    let issuesOnPage = 0;
    // TODO: Add logfile handling

    do {
        // TODO: Add logfile handling
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`;
        // TODO: Add logfile handling
        
        try {
            // TODO: Add logfile handling
            const response = await axios.get(issuesApiUrl, {
                // TODO: Add logfile handling
                headers: {
                    // TODO: Add logfile handling
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            // TODO: Add logfile handling
            issuesOnPage = response.data.length; // Number of open issues in this page
            // TODO: Add logfile handling
            totalOpenIssues += issuesOnPage;
            // TODO: Add logfile handling
            page++; // Move to the next page
            // TODO: Add logfile handling

        } catch (error) {
            // TODO: Add logfile handling
            console.error('Error fetching open issues:', error);
            // TODO: Add logfile handling
            return totalOpenIssues; // Return the count gathered so far
            // TODO: Add logfile handling
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    // TODO: Add logfile handling
    return totalOpenIssues;
}



//closed
async function fetchClosedIssuesCount(owner: string, repo: string): Promise<number> {
    // TODO: Add logfile handling
    let page = 1;
    // TODO: Add logfile handling
    let totalClosedIssues = 0;
    // TODO: Add logfile handling
    let issuesOnPage = 0;
    // TODO: Add logfile handling

    do {
        // TODO: Add logfile handling
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=100&page=${page}`;
        
        try {
            // TODO: Add logfile handling
            const response = await axios.get(issuesApiUrl, {
                // TODO: Add logfile handling
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            // TODO: Add logfile handling
            issuesOnPage = response.data.length; // Number of closed issues in this page
            // TODO: Add logfile handling
            totalClosedIssues += issuesOnPage;
            // TODO: Add logfile handling
            page++; // Move to the next page
            // TODO: Add logfile handling

        } catch (error) {
            // TODO: Add logfile handling
            console.error('Error fetching closed issues:', error);
            // TODO: Add logfile handling
            return totalClosedIssues; // Return the count gathered so far
            // TODO: Add logfile handling
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    // TODO: Add logfile handling
    return totalClosedIssues;
}

//end helper


/**
 * Gets the open and closed issue counts for a given URL.
 * If it's an npmjs URL, it fetches the issues via API calls.
 * If it's a GitHub URL, it extracts the open and closed issues from the `packageData` JSON.
 * 
 * @param {string} url - The npmjs or GitHub URL.
 * @param {any} packageData - The fetched package data (used for GitHub).
 * @returns {Promise<{ openIssuesCount: number, closedIssuesCount: number }>} An object containing the open and closed issue counts.
 */
export async function getIssuesCount(url: string, packageData: any): Promise<{ openIssuesCount: number, closedIssuesCount: number }> {
    // TODO: Add logfile handling
    const URL_type = url_type(url); // Check if the URL is GitHub or npmjs
    // TODO: Add logfile handling

    // TODO: Add logfile handling
    let openIssuesCount = 0;
    // TODO: Add logfile handling
    let closedIssuesCount = 0;
    // TODO: Add logfile handling

    // TODO: Add logfile handling
    if (URL_type === 'npmjs') {
        // TODO: Add logfile handling
        // Fetch open and closed issues for npmjs using API
        // TODO: Add logfile handling
        const issuesUrl = extractLastIssuesUrlFromJson(packageData); // Assuming packageData contains the issues URL
        // TODO: Add logfile handling
        if (issuesUrl) {
            // TODO: Add logfile handling
            const { owner, repo } = extractRepoFromIssuesUrl(issuesUrl); // Extract GitHub repo details
            // TODO: Add logfile handling
            openIssuesCount = await fetchOpenIssuesCount(owner, repo);
            // TODO: Add logfile handling
            closedIssuesCount = await fetchClosedIssuesCount(owner, repo);
            // TODO: Add logfile handling
        }
        // TODO: Add logfile handling
    } else if (URL_type === 'github') {
        // TODO: Add logfile handling
        // Extract open and closed issues from GitHub packageData JSON
        // TODO: Add logfile handling
        openIssuesCount = packageData.open_issues_count || 0; // Extract open issues from the JSON
        // TODO: Add logfile handling
        closedIssuesCount = packageData.closed_issues_count || 0; // Extract closed issues from the JSON
    } else {
        // TODO: Add logfile handling
        throw new Error('Invalid URL type. Only GitHub or npmjs URLs are supported.');
    }


    return { openIssuesCount, closedIssuesCount };
}

/**
 * Extracts the GitHub owner and repository name from a GitHub issues URL.
 * @param {string} url - The GitHub issues URL (e.g., 'https://github.com/substack/node-browserify/issues').
 * @returns {{ owner: string, repo: string }} - The owner and repository name.
 */
function extractRepoFromIssuesUrl(url: string): { owner: string, repo: string } {
    // TODO: Add logfile handling
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    // TODO: Add logfile handling
    const match = url.match(regex);
    // TODO: Add logfile handling
    
    // TODO: Add logfile handling
    if (match && match.length >= 3) {
        // TODO: Add logfile handling
        const owner = match[1];
        // TODO: Add logfile handling
        const repo = match[2];
        // TODO: Add logfile handling
       
        // TODO: Add logfile handling
        return { owner, repo };
    } else {
        // TODO: Add logfile handling
        throw new Error('Invalid GitHub issues URL');
    }
}