import axios from 'axios';

/**
 * Fetches metadata for a package from the npm registry.
 * @param {string} packageName - The name of the npm package.
 * @returns {Promise<{ data: any, fetchLatency: string }>} - The metadata of the package and the fetch latency.
 */
async function fetchNpmPackageData(packageName: string): Promise<{ data: any, fetchLatency: string }> {
    const registryUrl = `https://registry.npmjs.org/${packageName}`;
    try {
        const start = Date.now(); // Start timing
        const response = await axios.get(registryUrl);
        const fetchLatencyMs = Date.now() - start; // Calculate latency in milliseconds
        const fetchLatencySec = (fetchLatencyMs / 1000).toFixed(3); // Convert to seconds and round to 3 decimal places
        console.log(`FetchNpmPackageData Latency: ${fetchLatencySec} seconds`);

        return { data: response.data, fetchLatency: fetchLatencySec }; // Return data and fetch latency
    } catch (error) {
        console.error(`Error fetching data for package ${packageName}:`, error);
        throw error;
    }
}

//RAMP

function calculateRampUp(packageData: any, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

    const MAX_SIZE = 5000000; // Arbitrary maximum package size
    let size = 0;

    // Check if unpackedSize is available under the latest version
    const latestVersion = packageData['dist-tags']?.latest;
    const latestVersionData = packageData.versions?.[latestVersion];

    if (latestVersionData && latestVersionData.dist && latestVersionData.dist.unpackedSize) {
        size = latestVersionData.dist.unpackedSize;
    } else {
        console.warn('Package size information not available. Using default size of 0.');
    }

    // Calculate score based on size (the smaller the package, the higher the score)
    const score = 1 - Math.min(size / MAX_SIZE, 1); // Ensure score is between 0 and 1
    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round

    return { score, latency: totalLatencySec };
}

//end RAMP

// helper functions


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
        console.log(`URL: ${lastIssuesUrl}`);
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
        console.log(`owner: ${owner}`);
        console.log(`repo: ${repo}`);
        
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


//correctness

/**
 * Calculates the Correctness score based on the number of open issues.
 * @param {number} openIssuesCount - The number of open GitHub issues.
 * @param {string} fetchLatency - The latency of fetching the npm data.
 * @returns {number} The Correctness score (0-1).
 */
function calculateCorrectness(openIssuesCount: number, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing
    console.log(`open issues insideee: ${openIssuesCount}`);

    const MAX_ISSUES = 1000; // Define a maximum reasonable number of issues
    const score = 1 - Math.min(openIssuesCount / MAX_ISSUES, 1);

    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round
    return { score, latency: totalLatencySec };
}

//end correctness


//license


// /**
//  * Calculates the License score based on the license type.
//  * If GNU Lesser General Public License v2.1 is found, the score is 1; otherwise, 0.
//  * @param {any} packageData - The npm package data.
//  * @param {string} fetchLatency - The latency of fetching the npm data.
//  * @returns {number} The License score (0 or 1).
//  */
function calculateLicense_nogit(packageData: any, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

    const licenseType = packageData.license || 'Unknown';
    console.log(`licensse ${packageData.license}`);
    const score = licenseType.includes("Lesser General Public License v2.1") ? 1 : 0;

    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round
    return { score, latency: totalLatencySec };
}

//end license

//maintener

/**
 * Calculates the Responsive Maintainer score based on the recency of updates.
 * If the package has been updated within the last 6 months, give a higher score.
 * @param {any} packageData - The npm package data.
 * @param {string} fetchLatency - The latency of fetching the npm data.
 * @returns {number} The Responsive Maintainer score (0-1).
 */
function calculateResponsiveMaintainer (openIssuesCount: number, closedIssuesCount: number,  fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

 

    const ratio = openIssuesCount / closedIssuesCount;
    const score = 1 / (1+ ratio);
    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round
    return { score, latency: totalLatencySec };
}

//maintainer



/**
 * Main function to calculate and output all metrics for a given npm package URL.
 * @param {string} npmPackageUrl - The URL of the npm package.
 */async function main(npmPackageUrl: string) {
    try {
        const packageName = npmPackageUrl.split('/').pop(); // Get package name from the URL
        const { data: packageData, fetchLatency } = await fetchNpmPackageData(packageName!); // Fetch data and fetch latency
        
        // Calculate metrics with total latency (including fetch latency)
        const rampUp = calculateRampUp(packageData, fetchLatency);
        const license = await calculateLicense_nogit(packageData, fetchLatency); 
        
        
        console.log(`Metrics for package: ${packageName}`);
        const issuesUrl = extractLastIssuesUrlFromJson(packageData);

        const corec_time = Date.now();
        let openIssuesCount = 0; 
        let closedIssuesCount =0;

        if (issuesUrl) {
            const { owner, repo } = extractRepoFromIssuesUrl(issuesUrl);
            openIssuesCount = await fetchOpenIssuesCount(owner, repo); // Wait for fetch to complete
            closedIssuesCount = await fetchClosedIssuesCount(owner, repo);
            console.log(`count ${openIssuesCount}`);
            console.log(`Open issues for ${owner}/${repo}: ${openIssuesCount}`);
        } else {
            openIssuesCount = 0; // If no issues URL, default to 0
            closedIssuesCount =0;
        }
       
        const latency_correct = Date.now() - corec_time;

        const correctness = calculateCorrectness(openIssuesCount, fetchLatency);

        const responsiveMaintainer = calculateResponsiveMaintainer(openIssuesCount,closedIssuesCount, fetchLatency);
        


        // Output the results with total latency in seconds
        console.log(`Metrics for package: ${packageName}`);
        console.log(`RampUp Score: ${rampUp.score.toFixed(2)} (Total Latency: ${rampUp.latency} seconds)`);
        console.log(`Correctness Score: ${correctness.score.toFixed(2)} (Total Latency: ${correctness.latency + latency_correct} seconds)`);
        console.log(`License Score: ${license.score} (Total Latency: ${license.latency} seconds)`); // Use await before accessing properties
        console.log(`Responsive Maintainer Score: ${responsiveMaintainer.score} (Total Latency: ${responsiveMaintainer.latency} seconds)`);
    } catch (error) {
        console.error('Error processing package:', error);
    }
}

// Example usage: replace with any npm package URL
const npmPackageUrl = 'https://www.npmjs.com/package/express';
//const npmPackageUrl = 'https://www.npmjs.com/package/browserify';

main(npmPackageUrl).catch(console.error);




// my trial for getting license github


// /**
//  * Fetches the README content from the GitHub repository and checks for LGPLv2.1 under the "License" section.
//  * @param {string} owner - GitHub repository owner.
//  * @param {string} repo - GitHub repository name.
//  * @returns {Promise<boolean>} - Returns true if LGPLv2.1 is found under the "License" heading.
//  */
// async function checkReadmeForLicense(owner: string, repo: string): Promise<boolean> {
//     try {
//         // GitHub API to get README content
//         const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
//         const response = await axios.get(url, {
//             headers: {
//                 'Accept': 'application/vnd.github.v3.raw'
//             }
//         });

//         const readmeContent = response.data;

//         // Regular expression to find "License" section and check for LGPLv2.1
//         const licenseRegex = /#\s*License([\s\S]*?)LGPLv2\.1/i;
//         const match = readmeContent.match(licenseRegex);

//         return match !== null; // Returns true if LGPLv2.1 is found
//     } catch (error) {
//         console.error('Error fetching README or license not found:', error);
//         return false;
//     }
// }

// /**
//  * Fetches the LICENSE file from the GitHub repository and checks if it contains LGPLv2.1.
//  * @param {string} owner - GitHub repository owner.
//  * @param {string} repo - GitHub repository name.
//  * @returns {Promise<boolean>} - Returns true if LGPLv2.1 is found in the LICENSE file.
//  */
// async function checkLicenseFile(owner: string, repo: string): Promise<boolean> {
//     try {
//         // GitHub API to get LICENSE file content
//         const url = `https://api.github.com/repos/${owner}/${repo}/contents/LICENSE`;
//         const response = await axios.get(url, {
//             headers: {
//                 'Accept': 'application/vnd.github.v3.raw'
//             }
//         });

//         const licenseContent = response.data;

//         // Check if LGPLv2.1 is mentioned in the LICENSE file
//         return /LGPLv2\.1/i.test(licenseContent);
//     } catch (error) {
//         console.error('Error fetching LICENSE file or license not found:', error);
//         return false;
//     }
// }

// /**
//  * Main function to check if the package has LGPLv2.1 in either README or LICENSE file.
//  * @param {string} owner - GitHub repository owner.
//  * @param {string} repo - GitHub repository name.
//  * @returns {Promise<boolean>} - Returns true if LGPLv2.1 is found in either the README or LICENSE.
//  */
// async function checkForLGPLv21(owner: string, repo: string): Promise<boolean> {
//     // Check README for license description
//     const readmeHasLicense = await checkReadmeForLicense(owner, repo);

//     // Check LICENSE file for license description
//     const licenseFileHasLicense = await checkLicenseFile(owner, repo);

//     // Return true if either README or LICENSE file contains LGPLv2.1
//     return readmeHasLicense || licenseFileHasLicense;
// }