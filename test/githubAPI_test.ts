// let git

import { fetchJsonFromApi } from "../src/API";
import { getContributionCounts, getGitHubAPILink } from "../src/github_data";

// Main async function to fetch and process data
async function main() {
    try {
        let githubData = await fetchJsonFromApi(getGitHubAPILink("https://github.com/cloudinary/cloudinary_npm", "contributors"));
        console.log("Is GitHub Data an Array?", Array.isArray(githubData));

        if (Array.isArray(githubData)) {
            console.log("Number of Contributors:", githubData.length);
            let contributions = getContributionCounts(githubData);
            console.log(contributions);
        } else {
            console.error("Expected an array of contributors.");
        }
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
    }
}


main();