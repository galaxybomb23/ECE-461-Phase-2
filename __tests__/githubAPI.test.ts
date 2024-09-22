
import { fetchJsonFromApi } from '../src/API';
import { logMessage } from '../src/logFile'; // Assuming logging needs to be mocked
import axios from 'axios'; // Axios will be mocked for API calls
import { fetchOpenIssuesCount, fetchClosedIssuesCount, getContributionCounts, getGitHubAPILink } from '../src/githubData';

// Mock dependencies
jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));

jest.mock('../src/logFile', () => ({
  logMessage: jest.fn(),
}));

jest.mock('axios');

describe('GitHub API Tests', () => {
  // Existing tests...
});

describe('fetchOpenIssuesCount', () => {
  const mockOwner = 'cloudinary';
  const mockRepo = 'cloudinary_npm';
  const issuesApiUrl = (page: number) =>
    `https://api.github.com/repos/${mockOwner}/${mockRepo}/issues?state=open&per_page=100&page=${page}`;

  it('should fetch and count open issues from GitHub', async () => {
    // Mock Axios to return a paginated response for open issues
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: new Array(100).fill({}), // 100 issues on page 1
    });
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: new Array(50).fill({}), // 50 issues on page 2
    });

    const openIssuesCount = await fetchOpenIssuesCount(mockOwner, mockRepo);

    // We expect the total number of open issues to be 150 (100 + 50)
    expect(openIssuesCount).toEqual(150);
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(1));
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(2));
  });

  it('should return 0 if no open issues are found', async () => {
    // Mock Axios to return an empty array of issues
    jest.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const openIssuesCount = await fetchOpenIssuesCount(mockOwner, mockRepo);

    expect(openIssuesCount).toEqual(0);
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(1));
  });

  it('should handle errors gracefully and return the count so far', async () => {
    // Mock Axios to throw an error on the first page
    jest.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const openIssuesCount = await fetchOpenIssuesCount(mockOwner, mockRepo);

    expect(openIssuesCount).toEqual(0); // No issues retrieved before the error
    expect(logMessage).toHaveBeenCalledWith(
      'fetchOpenIssuesCount - API Error',
      expect.arrayContaining([expect.stringContaining('API Error')])
    );
  });
});

describe('fetchClosedIssuesCount', () => {
  const mockOwner = 'cloudinary';
  const mockRepo = 'cloudinary_npm';
  const issuesApiUrl = (page: number) =>
    `https://api.github.com/repos/${mockOwner}/${mockRepo}/issues?state=closed&per_page=100&page=${page}`;

  it('should fetch and count closed issues from GitHub', async () => {
    // Mock Axios to return a paginated response for closed issues
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: new Array(100).fill({}), // 100 issues on page 1
    });
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: new Array(30).fill({}), // 30 issues on page 2
    });

    const closedIssuesCount = await fetchClosedIssuesCount(mockOwner, mockRepo);

    // We expect the total number of closed issues to be 130 (100 + 30)
    expect(closedIssuesCount).toEqual(130);
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(1));
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(2));
  });

  it('should return 0 if no closed issues are found', async () => {
    // Mock Axios to return an empty array of issues
    jest.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const closedIssuesCount = await fetchClosedIssuesCount(mockOwner, mockRepo);

    expect(closedIssuesCount).toEqual(0);
    expect(axios.get).toHaveBeenCalledWith(issuesApiUrl(1));
  });

  it('should handle errors gracefully and return the count so far', async () => {
    // Mock Axios to throw an error on the first page
    jest.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const closedIssuesCount = await fetchClosedIssuesCount(mockOwner, mockRepo);

    expect(closedIssuesCount).toEqual(0); // No issues retrieved before the error
    expect(logMessage).toHaveBeenCalledWith(
      'fetchClosedIssuesCount - API Error',
      expect.arrayContaining([expect.stringContaining('API Error')])
    );
  });
});
describe('GitHub API Tests', () => {
  it('should fetch GitHub contributors and count contributions', async () => {
    // Mocking the API response with contributor data
    const mockGitHubData = [
      { contributions: 148 },
      { contributions: 96 },
      { contributions: 63 },
      { contributions: 1 },
    ];

    // Mock the API to resolve with the mocked data
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockGitHubData);

    // Call the main function that interacts with the API
    const githubData = await fetchJsonFromApi(
      getGitHubAPILink('https://github.com/cloudinary/cloudinary_npm', 'contributors')
    );

    // Ensure the data is an array
    expect(Array.isArray(githubData)).toBe(true);
    expect(githubData.length).toBe(mockGitHubData.length);

    // Call the function that processes the contribution data
    const contributions = getContributionCounts(githubData);

    // Verify the expected contribution counts
    expect(contributions).toEqual([148, 96, 63, 1]);
  });
});

describe('getGitHubAPILink', () => {
    it('should construct the correct API URL without an endpoint', () => {
        const url = 'https://github.com/cloudinary/cloudinary_npm';
        const expectedApiUrl = 'https://api.github.com/repos/cloudinary/cloudinary_npm';
        const apiUrl = getGitHubAPILink(url);
        expect(apiUrl).toBe(expectedApiUrl);
    });

    it('should construct the correct API URL with an endpoint', () => {
        const url = 'https://github.com/cloudinary/cloudinary_npm';
        const endpoint = 'contributors';
        const expectedApiUrl = 'https://api.github.com/repos/cloudinary/cloudinary_npm/contributors';
        const apiUrl = getGitHubAPILink(url, endpoint);
        expect(apiUrl).toBe(expectedApiUrl);
    });
});