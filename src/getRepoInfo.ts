import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

/**
 * Extracts the owner and repo from a GitHub repository URL.
 * @param {string} url - The GitHub repository URL (e.g., https://github.com/owner/repo).
 * @returns {{ owner: string, repo: string }} An object containing the owner and repo.
 */
function extractRepoFromGithubUrl(url: string): { owner: string, repo: string } {
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
        const owner = match[1];
        const repo = match[2];
        return { owner, repo };
    } else {
        throw new Error('Invalid GitHub URL format.');
    }
}

/**
 * Fetches repository data from the GitHub API.
 * 
 * This function will:
 * - Fetch repository details (size, issues, forks, etc.)
 * - Fetch open and closed issues count
 * - Fetch license information
 *
 * @param {string} apiLink - The GitHub repository URL.
 * @returns {Promise<any>} A promise that resolves to the combined repository data.
 */
export async function fetchGithubRepoData(apiLink: string): Promise<any> {
    const { owner, repo } = extractRepoFromGithubUrl(apiLink); // Extract owner and repo

    const token = process.env.GITHUB_TOKEN;

    // Set up headers conditionally based on the presence of the token
    const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // Fetch repo details (size, issues, forks, etc.)
        const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const repoResponse = await axios.get(repoApiUrl, { headers });

        // Fetch open issues count
        const openIssuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`;
        const openIssuesResponse = await axios.get(openIssuesApiUrl, { headers });
        const openIssuesCount = openIssuesResponse.data.length;

        // Fetch closed issues count
        const closedIssuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=100`;
        const closedIssuesResponse = await axios.get(closedIssuesApiUrl, { headers });
        const closedIssuesCount = closedIssuesResponse.data.length;

        // Fetch license information
        const licenseApiUrl = `https://api.github.com/repos/${owner}/${repo}/license`;
        let license = 'None';
        try {
            const licenseResponse = await axios.get(licenseApiUrl, { headers });
            license = licenseResponse.data.license?.spdx_id || 'None';
        } catch (error) {
            console.log('No license found, defaulting to "None"');
        }

        // Construct the combined data
        const combinedData = {
            name: repoResponse.data.name,
            owner: repoResponse.data.owner.login,
            repo: repoResponse.data.full_name,
            size: repoResponse.data.size,
            stars: repoResponse.data.stargazers_count,
            forks: repoResponse.data.forks_count,
            open_issues_count: openIssuesCount,
            closed_issues_count: closedIssuesCount,
            license: license,
            last_updated: repoResponse.data.updated_at,
        };

        // Stringify and write the metadata to a file
        const metadataFilePath = './metadata_github.json';
        fs.writeFileSync(metadataFilePath, JSON.stringify(combinedData, null, 2), 'utf-8');

        return combinedData;
    } catch (error) {
        console.error('Error fetching data from GitHub API:', error);
        throw error;
    }
}