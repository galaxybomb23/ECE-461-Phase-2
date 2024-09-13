
/**
 * Generates a GitHub API URL to fetch the contributors of a repository
 * based on the provided GitHub repository URL.
 *
 * @param {string} Url - The URL of the GitHub repository (e.g., https://github.com/owner/repo)
 * @returns {string} The API URL for retrieving contributors (e.g., https://api.github.com/repos/owner/repo/contributors)
 */
function getAPILink(Url: string): string {
    let url_parts = Url.split('/');

    let owner = url_parts[url_parts.length - 2];
    let repo = url_parts[url_parts.length - 1];

    return `https://api.github.com/repos/${owner}/${repo}/contributors`;
}

function getContributorCount(Data: any): number {
    let git
}
