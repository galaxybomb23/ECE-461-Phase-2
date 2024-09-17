import * as sqlite3 from 'sqlite3';
import { getGitHubAPILink } from './../github_data';
import { fetchJsonFromApi } from './../API';

// Define types for GitHub data
interface Issue {
  created_at: string; // Date when the issue was created
  updated_at: string; // Date when the issue was last updated
  comments: number;  // Number of comments on the issue
  number: number;    // Issue number
}

interface PullRequest {
  created_at: string; // Date when the pull request was created
  merged_at?: string; // Date when the pull request was merged (optional)
  number: number;    // Pull request number
}

interface Comment {
  created_at: string; // Date when the comment was created
}

/**
 * Calculates the difference in hours between two dates.
 * 
 * @param start - The start date.
 * @param end - The end date.
 * @returns The time difference in hours.
 */
const getTimeDifferenceInHours = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

/**
 * Parses a GitHub URL to extract the owner and repository names.
 * 
 * @param url - The GitHub repository URL.
 * @returns An object containing the owner and repo names.
 */
const parseGitHubURL = (url: string): { owner: string; repo: string } => {
  const urlParts = url.split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];
  return { owner, repo };
};

/**
 * Fetches issues from a GitHub repository.
 * 
 * @param owner - The repository owner.
 * @param repo - The repository name.
 * @returns A promise that resolves to a list of issues.
 */
const getIssues = async (owner: string, repo: string): Promise<Issue[]> => {
  const apiUrl = getGitHubAPILink(`https://github.com/${owner}/${repo}`, 'issues');
  return fetchJsonFromApi(apiUrl);
};

/**
 * Fetches pull requests from a GitHub repository.
 * 
 * @param owner - The repository owner.
 * @param repo - The repository name.
 * @returns A promise that resolves to a list of pull requests.
 */
const getPullRequests = async (owner: string, repo: string): Promise<PullRequest[]> => {
  const apiUrl = getGitHubAPILink(`https://github.com/${owner}/${repo}`, 'pulls');
  return fetchJsonFromApi(apiUrl);
};

/**
 * Fetches comments for a specific issue from a GitHub repository.
 * 
 * @param owner - The repository owner.
 * @param repo - The repository name.
 * @param issueNumber - The issue number.
 * @returns A promise that resolves to a list of comments for the issue.
 */
const getIssueComments = async (owner: string, repo: string, issueNumber: number): Promise<Comment[]> => {
  const apiUrl = getGitHubAPILink(`https://github.com/${owner}/${repo}`, `issues/${issueNumber}/comments`);
  return fetchJsonFromApi(apiUrl);
};

/**
 * Fetches comments for a specific pull request from a GitHub repository.
 * 
 * @param owner - The repository owner.
 * @param repo - The repository name.
 * @param pullNumber - The pull request number.
 * @returns A promise that resolves to a list of comments for the pull request.
 */
const getPullRequestComments = async (owner: string, repo: string, pullNumber: number): Promise<Comment[]> => {
  const apiUrl = getGitHubAPILink(`https://github.com/${owner}/${repo}`, `pulls/${pullNumber}/comments`);
  return fetchJsonFromApi(apiUrl);
};

/**
 * Calculates the responsiveness score for a GitHub repository based on issues, pull requests, and comments.
 * 
 * @param githubUrl - The GitHub repository URL.
 * @returns A promise that resolves to the normalized responsiveness score.
 */
const calculateResponsiveness = async (githubUrl: string) => {
  const { owner, repo } = parseGitHubURL(githubUrl);

  // Fetch issues and pull requests
  const issues = await getIssues(owner, repo);
  const pullRequests = await getPullRequests(owner, repo);

  // Calculate issue response times
  let issueResponseTimes: number[] = [];
  for (const issue of issues) {
    if (issue.comments > 0) {
      const firstCommentDate = new Date(issue.updated_at);
      const creationDate = new Date(issue.created_at);
      issueResponseTimes.push(getTimeDifferenceInHours(creationDate, firstCommentDate));
    }
  }
  const avgIssueResponseTime = issueResponseTimes.length ? issueResponseTimes.reduce((a, b) => a + b) / issueResponseTimes.length : 0;

  // Calculate pull request merge times
  let prMergeTimes: number[] = [];
  for (const pr of pullRequests) {
    if (pr.merged_at) {
      const mergeDate = new Date(pr.merged_at);
      const creationDate = new Date(pr.created_at);
      prMergeTimes.push(getTimeDifferenceInHours(creationDate, mergeDate));
    }
  }
  const avgPrMergeTime = prMergeTimes.length ? prMergeTimes.reduce((a, b) => a + b) / prMergeTimes.length : 0;

  // Calculate comment activity
  let totalComments = 0;
  for (const issue of issues) {
    const comments = await getIssueComments(owner, repo, issue.number);
    totalComments += comments.length;
  }

  for (const pr of pullRequests) {
    const comments = await getPullRequestComments(owner, repo, pr.number);
    totalComments += comments.length;
  }

  const avgComments = (issues.length + pullRequests.length) ? totalComments / (issues.length + pullRequests.length) : 0;

  // Define weights for each metric
  const weights = {
    issueResponseTime: 0.3,
    prMergeTime: 0.4,
    commentActivity: 0.3
  };

  // Calculate scores for each metric
  const issueResponseScore = avgIssueResponseTime > 0 ? 1 / avgIssueResponseTime : 1;
  const prMergeScore = avgPrMergeTime > 0 ? 1 / avgPrMergeTime : 1;
  const commentActivityScore = avgComments;

  // Combine scores into final score
  const finalScore = (issueResponseScore * weights.issueResponseTime +
                       prMergeScore * weights.prMergeTime +
                       commentActivityScore * weights.commentActivity) / 
                      (weights.issueResponseTime + weights.prMergeTime + weights.commentActivity);

  // Normalize the final score to a scale from 0 to 1
  const normalizedScore = Math.min(Math.max(finalScore, 0), 1);

  return normalizedScore;
};

// Example usage
// calculateResponsiveness('https://github.com/nullivex/nodist').then(score => console.log(`Responsiveness Score: ${score}`));