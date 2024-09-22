import { calculateCorrectness } from '../src/metrics/correctness';
import { fetchJsonFromApi } from '../src/API';
import { getGitHubAPILink } from '../src/githubData';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';


// Mock dependencies
jest.mock('../API');
jest.mock('../githubData');
jest.mock('./getLatency');
jest.mock('../logFile');

describe('calculateCorrectness', () => {
  const mockRepoURL = 'https://github.com/example/repo';
  const mockRepoData = { open_issues_count: 5 }; // Mock repo with 5 open issues
  const mockClosedPulls = [1, 2, 3]; // 3 closed pull requests
  const mockOpenPulls = [4]; // 1 open pull request
  const mockClosedIssues = [5, 6]; // 2 closed issues
  const mockOpenIssues = [7, 8, 9]; // 3 open issues

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid correctness score and latency for a valid repository URL', async () => {
    // Mock the API calls and other dependencies
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoData) // Repo data
      .mockResolvedValueOnce(mockClosedPulls) // Closed pull requests
      .mockResolvedValueOnce(mockOpenPulls) // Open pull requests
      .mockResolvedValueOnce(mockClosedIssues) // Closed issues
      .mockResolvedValueOnce(mockOpenIssues); // Open issues
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1007); // End time

    const result = await calculateCorrectness(mockRepoURL);

    expect(result.score).toBeGreaterThan(0); // Score should be > 0
    expect(result.score).toEqual(0.9); // Based on the mock data
    expect(result.latency).toEqual(7); // Latency of 7ms (1007 - 1000)
    expect(getGitHubAPILink).toHaveBeenCalledWith(mockRepoURL);
    expect(fetchJsonFromApi).toHaveBeenCalledTimes(5); // Five API calls
  });

  it('should return a score of 1 for a repository with no open issues and all closed pull requests', async () => {
    // Mock data where all issues and pull requests are closed
    const mockRepoDataWithNoIssues = { open_issues_count: 0 };

    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoDataWithNoIssues) // Repo data
      .mockResolvedValueOnce(mockClosedPulls) // Closed pull requests
      .mockResolvedValueOnce([]) // No open pull requests
      .mockResolvedValueOnce(mockClosedIssues) // Closed issues
      .mockResolvedValueOnce([]); // No open issues
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1003); // End time

    const result = await calculateCorrectness(mockRepoURL);

    expect(result.score).toEqual(1); // Perfect score for no open issues/pull requests
    expect(result.latency).toEqual(3); // Latency of 3ms (1003 - 1000)
  });

  it('should handle API errors gracefully', async () => {
    // Simulate an API error for one of the calls
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/error-repo');
    (fetchJsonFromApi as jest.Mock).mockRejectedValue(new Error('API Error'));
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1005); // Simulate latency

    await expect(calculateCorrectness('https://github.com/error-repo')).rejects.toThrow('API Error');
  });

  it('should return a score of 0 if the repository has too many open issues', async () => {
    // Mock data where open issues exceed the maximum
    const mockRepoDataWithManyIssues = { open_issues_count: 200 }; // Exceeds the MAX_ISSUES

    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoDataWithManyIssues) // Repo data
      .mockResolvedValueOnce(mockClosedPulls) // Closed pull requests
      .mockResolvedValueOnce(mockOpenPulls) // Open pull requests
      .mockResolvedValueOnce(mockClosedIssues) // Closed issues
      .mockResolvedValueOnce(mockOpenIssues); // Open issues
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1006); // End time

    const result = await calculateCorrectness(mockRepoURL);

    expect(result.score).toEqual(0); // Too many open issues should result in a low score
    expect(result.latency).toEqual(6); // Latency of 6ms (1006 - 1000)
  });

  it('should calculate a score based on the resolution rates of issues and pull requests', async () => {
    // Mock data for calculating resolution rates
    const mockRepoDataWithIssues = { open_issues_count: 50 };

    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoDataWithIssues) // Repo data
      .mockResolvedValueOnce(mockClosedPulls) // Closed pull requests
      .mockResolvedValueOnce(mockOpenPulls) // Open pull requests
      .mockResolvedValueOnce(mockClosedIssues) // Closed issues
      .mockResolvedValueOnce(mockOpenIssues); // Open issues
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1008); // End time

    const result = await calculateCorrectness(mockRepoURL);

    expect(result.score).toBeGreaterThan(0); // Score should reflect issue/pull request resolution rates
    expect(result.latency).toEqual(8); // Latency of 8ms (1008 - 1000)
  });
});