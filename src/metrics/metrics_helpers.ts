import axios from 'axios';
import * as fs from 'fs';
import {fetchGithubRepoData} from './API';
import { calculateCorrectness } from './correctness';
import { calculateLicense } from './license';
import { calculateRampUpMain } from './rampUp';
import { calculateResponsiveMaintainer } from './responsiveMaintainer';

// import { calculateNetScore } from './netScore'; //not yet




async function fetchNpmPackageData(npmPackageUrl: string): Promise<{ data: any, fetchLatency: string }> {
    const packageName = npmPackageUrl.split('/').pop(); // Get package name from the URL

    const registryUrl = `https://registry.npmjs.org/${packageName}`;
    try {
        const start = Date.now(); // Start timing
        const response = await axios.get(registryUrl);
        const fetchLatencyMs = Date.now() - start; // Calculate latency in milliseconds
        const fetchLatencySec = (fetchLatencyMs / 1000).toFixed(3); // Convert to seconds and round to 3 decimal places
   

        return { data: response.data, fetchLatency: fetchLatencySec }; // Return data and fetch latency
    } catch (error) {
        console.error(`Error fetching data for package ${packageName}:`, error);
        throw error;
    }
}


//function to determine url type

function determineUrlType(url: string): 'github' | 'npmjs' | 'unknown' {
    if (url.includes('github.com')) {
        return 'github';
    } else if (url.includes('npmjs.com')) {
        return 'npmjs';
    } else {
        return 'unknown';
    }
}

async function getJSON(url: string): Promise<any> {
    const URL_type = determineUrlType(url); // Determine if the URL is GitHub or npmjs

    let packageData: any;
    

    try {
        if (URL_type === 'github') {
            packageData = await fetchGithubRepoData(url); // Fetch data from GitHub
            return packageData;
        } else if (URL_type === 'npmjs') {
            throw new Error('We Asume it needs a github'); // exit on 1 error
            return packageData;
         
        } else {
            throw new Error('Invalid URL type. Only GitHub or npmjs URLs are supported.');
        }

        
        
        return packageData;
    } catch (error) {
        console.error('Error fetching package data:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
}


/**
 * Extracts the GitHub issues URL (bugs.url) from any version of the package JSON data.
 * @param {any} packageData - The package JSON data.
 * @returns {string | null} - The GitHub issues URL if found, or null if not found.
 */

function extractLastIssuesUrlFromJson(packageData: any): string | null {
    const versions = packageData.versions;
    let lastIssuesUrl: string | null = null;

    // Iterate through the versions object
    for (const version in versions) {
        if (versions.hasOwnProperty(version)) {
            const versionData = versions[version];
            if (versionData.bugs && versionData.bugs.url) {
                lastIssuesUrl = versionData.bugs.url;  // Update to the latest found bugs.url
            }
        }
    }

    if (lastIssuesUrl) {
    
        return lastIssuesUrl;
    } else {
        console.warn('No GitHub issues URL found in any version.');
        return null;
    }
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
    const URL_type = determineUrlType(url); // Check if the URL is GitHub or npmjs

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
 * Main function to calculate and output all metrics for a given npm package URL.
 * @param {string} npmPackageUrl - The URL of the npm package.
 */async function main(npmPackageUrl: string) {
    try {
        const start = Date.now();
        
        const  packageData  = await getJSON(npmPackageUrl); // Fetch data and fetch latency
        // const metadataFilePath = './META.json';
        // fs.writeFileSync(metadataFilePath, JSON.stringify(packageData, null, 2), 'utf-8');
        //const { data: packageData, fetchLatency } = await fetchNpmPackageData(packageName!); // Fetch data and fetch latency
        const pack_type = determineUrlType(npmPackageUrl);
         


        const fetchLatencyp =Date.now() - start
        const fetchLatency = (fetchLatencyp / 1000).toFixed(3); // Convert to seconds and round to 3 decimal places; 
        
        // Calculate metrics with total latency (including fetch latency)
        const rampUp = calculateRampUpMain(packageData, fetchLatency, pack_type);
        const license = await calculateLicense(packageData, fetchLatency); 
        
        
      

        const corec_time = Date.now();
        const { openIssuesCount, closedIssuesCount } = await getIssuesCount(npmPackageUrl, packageData);

        
       
        const latency_correct = Date.now() - corec_time;

        const correctness = calculateCorrectness(openIssuesCount, fetchLatency);

        const responsiveMaintainer = calculateResponsiveMaintainer(openIssuesCount,closedIssuesCount, fetchLatency);
        


        // Output the results with total latency in seconds
        console.log(`Metrics for package: ${npmPackageUrl}`);
        console.log(`RampUp Score: ${rampUp.score.toFixed(2)} (Total Latency: ${rampUp.latency} seconds)`);
        console.log(`Correctness Score: ${correctness.score.toFixed(2)} (Total Latency: ${correctness.latency + latency_correct} seconds)`);
        console.log(`License Score: ${license.score} (Total Latency: ${license.latency} seconds)`); // Use await before accessing properties
        console.log(`Responsive Maintainer Score: ${responsiveMaintainer.score} (Total Latency: ${responsiveMaintainer.latency} seconds)`);
    } catch (error) {
        console.error('Error processing package:', error);
    }
}

// Example usage: replace with any npm package URL
// const npmPackageUrl = 'https://www.npmjs.com/package/express';
//const npmPackageUrl = 'https://www.npmjs.com/package/browserify';
//const npmPackageUrl = 'https://github.com/nullivex/nodist';
const npmPackageUrl ='https://github.com/browserify/browserify';

main(npmPackageUrl).catch(console.error);

