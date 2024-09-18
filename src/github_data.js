"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubAPILink = getGitHubAPILink;
exports.getContributionCounts = getContributionCounts;
/**
 * Generates a GitHub API URL based on the provided repository URL and endpoint.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., https://github.com/owner/repo).
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches').
 * @returns {string} The GitHub API URL for the specified endpoint.
 */
function getGitHubAPILink(url, endpoint) {
    if (endpoint === void 0) { endpoint = ''; }
    // Split the URL to extract the repository owner and name.
    var urlParts = url.split('/'); // Split link into parts
    var owner = urlParts[urlParts.length - 2]; // Isolate owner
    var repo = urlParts[urlParts.length - 1]; // Isolate repository name
    return "https://api.github.com/repos/".concat(owner, "/").concat(repo).concat(endpoint ? '/' + endpoint : ''); // Return API link with endpoint
}
/**
 * Extracts contribution counts from the GitHub API response data.
 *
 * @param {any[]} data - The response data from the GitHub API, where each item represents a contributor.
 * @returns {number[]} An array of contribution counts, one for each contributor.
 */
function getContributionCounts(data) {
    // Initialize an empty array to store contribution counts.
    var contributionCounts = [];
    // Iterate over each item in the response data.
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        // Check if the 'contributions' field exists and is a number.
        if (typeof item.contributions === 'number') {
            contributionCounts.push(item.contributions);
        }
    }
    // Return the array of contribution counts.
    return contributionCounts;
}
