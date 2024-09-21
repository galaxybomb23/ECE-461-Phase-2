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
    let urlParts = url.split('/');  // Split link into parts
    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    let repo = urlParts[urlParts.length - 1];   // Isolate repository name

    // Check if repo contains ".git" and remove it if necessary
    if (repo.endsWith('.git')) {
        repo = repo.slice(0, -4); // Remove the last 4 characters (".git")
    }


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


/**
 * Fetches the number of open issues for a given GitHub repository.
 * @param {string} owner - The GitHub owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<number>} - The number of open issues.
//  */

async function fetchOpenIssuesCount(owner: string, repo: string): Promise<number> {
    let page = 1;
    let totalOpenIssues = 0;
    let issuesOnPage = 0;

    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`;
        
        try {
            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            issuesOnPage = response.data.length; // Number of open issues in this page
            totalOpenIssues += issuesOnPage;
            page++; // Move to the next page

        } catch (error) {
            console.error('Error fetching open issues:', error);
            return totalOpenIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    return totalOpenIssues;
}



//closed
async function fetchClosedIssuesCount(owner: string, repo: string): Promise<number> {
    let page = 1;
    let totalClosedIssues = 0;
    let issuesOnPage = 0;

    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=100&page=${page}`;
        
        try {
            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            issuesOnPage = response.data.length; // Number of closed issues in this page
            totalClosedIssues += issuesOnPage;
            page++; // Move to the next page

        } catch (error) {
            console.error('Error fetching closed issues:', error);
            return totalClosedIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

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
    const URL_type = url_type(url); // Check if the URL is GitHub or npmjs

    let openIssuesCount = 0;
    let closedIssuesCount = 0;

    if (URL_type === 'npmjs') {
        // Fetch open and closed issues for npmjs using API
        const issuesUrl = extractLastIssuesUrlFromJson(packageData); // Assuming packageData contains the issues URL
        if (issuesUrl) {
            const { owner, repo } = extractRepoFromIssuesUrl(issuesUrl); // Extract GitHub repo details
            openIssuesCount = await fetchOpenIssuesCount(owner, repo);
            closedIssuesCount = await fetchClosedIssuesCount(owner, repo);
        }
    } else if (URL_type === 'github') {
        // Extract open and closed issues from GitHub packageData JSON
        openIssuesCount = packageData.open_issues_count || 0; // Extract open issues from the JSON
        closedIssuesCount = packageData.closed_issues_count || 0; // Extract closed issues from the JSON
    } else {
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
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);
    
    if (match && match.length >= 3) {
        const owner = match[1];
        const repo = match[2];
       
        
        return { owner, repo };
    } else {
        throw new Error('Invalid GitHub issues URL');
    }
}