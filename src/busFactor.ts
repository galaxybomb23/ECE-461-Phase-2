import axios from 'axios'; // Import the axios library for making HTTP requests

// Define types for the GitHub API responses
type Commit = { 
    author: { 
        login: string; // 'login' is the username of the author who made the commit
    };
};

// Define environment variables for the GitHub token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''; // Get the GitHub token from the environment variable or use an empty string if not available

// Function to get commits from a GitHub repository
async function getCommits(owner: string, repo: string): Promise<Commit[]> {
    try {
        // Make a GET request to the GitHub API to fetch commits for the specified repository
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`, // Pass the GitHub token for authorization
            },
            params: {
                per_page: 100, // Limit the number of commits per page (100 is the max GitHub allows)
            },
        });
        return response.data; // Return the list of commits fetched from the API
    } catch (error) {
        console.error('Error fetching commits:', error); // Log an error if the request fails
        return []; // Return an empty array if there was an error
    }
}

// Function to calculate the bus factor based on commit data
function calculateBusFactor(commits: Commit[]): number {
    const authorCommitCount: Record<string, number> = {}; // Create an object to store the number of commits per author

    // Count commits per author
    commits.forEach(commit => {
        const author = commit.author?.login; // Extract the author's username from each commit
        if (author) {
            authorCommitCount[author] = (authorCommitCount[author] || 0) + 1; // Increment the commit count for that author, or initialize it if it's the first time
        }
    });

    const totalCommits = commits.length; // Get the total number of commits
    const authors = Object.keys(authorCommitCount); // Get a list of all unique authors
    const authorContributions = Object.values(authorCommitCount); // Get the number of commits made by each author

    // Sort contributions in descending order to measure reliance on key contributors
    authorContributions.sort((a, b) => b - a); // Sort the number of commits by authors from highest to lowest

    // Determine how many contributors would need to stop working for the project to stall
    let cumulativeCommits = 0; // A counter for the cumulative number of commits made by the top contributors
    let busFactor = 0; // A counter for the bus factor (i.e., how many contributors account for the majority of commits)

    // Iterate over the sorted list of contributions
    for (const contributions of authorContributions) {
        cumulativeCommits += contributions; // Add the current author's contributions to the cumulative count
        busFactor++; // Increase the bus factor (number of key contributors)
        if (cumulativeCommits >= totalCommits * 0.5) { // Stop when the top contributors account for 50% or more of total commits
            break; // Exit the loop once the bus factor is determined
        }
    }

    return busFactor; // Return the calculated bus factor
}

// Main function to calculate and print the bus factor of a GitHub repository
async function main(owner: string, repo: string) {
    console.log(`Calculating bus factor for repository: ${owner}/${repo}...`); // Log which repository is being analyzed

    const commits = await getCommits(owner, repo); // Fetch the commit data for the repository

    if (commits.length === 0) { // Check if no commits were found or if there was an error
        console.log('No commits found or error fetching data.'); // Log an error message
        return; // Exit the function early
    }

    const busFactor = calculateBusFactor(commits); // Calculate the bus factor based on the commit data
    console.log(`Bus Factor: ${busFactor}`); // Print the bus factor to the console
}

// Replace with the owner and repository you want to analyze
const owner = 'Miller11k'; // Specify the GitHub username or organization
const repo = 'ECE-461'; // Specify the repository name

main(owner, repo); // Call the main function to start the analysis
