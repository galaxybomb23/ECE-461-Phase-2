import { calculateResponsiveMaintainer } from '../src/metrics/responsiveMaintainer';
import { getGitHubAPILink } from '../src/githubData';
import { fetchJsonFromApi } from '../src/API';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';
import { logMessage } from '../src/logFile';

// Mock all the external dependencies
jest.mock('../src/API');
jest.mock('../src/githubData');
jest.mock('../src/metrics/getLatency');
jest.mock('../src/logFile');

describe('calculateResponsiveMaintainer', () => {
  const mockRepoURL = 'https://github.com/example/repo';
  const mockRepoData = { open_issues_count: 10 };
  const mockIssuesData = [
    { closed_at: '2023-05-10T12:34:56Z' },
    { closed_at: null },
    { closed_at: '2023-04-15T09:45:30Z' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate a valid responsive maintainer score with both open and closed issues', async () => {
    // Mock the API and latency functions
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock).mockResolvedValueOnce(mockRepoData).mockResolvedValueOnce(mockIssuesData);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1003);
  
    const result = await calculateResponsiveMaintainer(mockRepoURL);
  
    // Ensure the log messages match the actual function implementation
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Starting Responsive Maintainer score calculation.', `Repository URL: ${mockRepoURL}`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Latency tracking started.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Constructed API link for repository data.', `API Link: https://api.github.com/repos/example/repo`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Fetched repository and issues data successfully.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', [`Counted issues - Open: 1, Closed: 2`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Using open issues count from repoData.', `Open Issues Count: 10`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated Responsive Maintainer score.', `Score: 0.17`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated fetch latency.', `Latency: 3.000 ms`]);
  
    // Score calculation
    expect(result.score).toEqual(0.17);
    expect(result.latency).toEqual(3.0);
  });
  
  it('should handle cases with no closed issues gracefully and return a max score', async () => {
    // Mock the API and latency functions
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock).mockResolvedValueOnce(mockRepoData).mockResolvedValueOnce([{ closed_at: null }]); // Only open issue
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1002);
  
    const result = await calculateResponsiveMaintainer(mockRepoURL);
  
    // Updated log expectations based on actual flow
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Starting Responsive Maintainer score calculation.', `Repository URL: ${mockRepoURL}`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Latency tracking started.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Constructed API link for repository data.', `API Link: https://api.github.com/repos/example/repo`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Fetched repository and issues data successfully.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', [`Counted issues - Open: 1, Closed: 0`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Using open issues count from repoData.', `Open Issues Count: 10`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated Responsive Maintainer score.', `Score: 1`]); // Max score due to no closed issues
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated fetch latency.', `Latency: 2.000 ms`]);
  
    // If there are no closed issues, score should be 1
    expect(result.score).toEqual(1);
    expect(result.latency).toEqual(2.0); // 2 ms latency
  });
  
  it('should return a zero score when there are only open issues and no closed ones in repoData', async () => {
    const mockRepoDataOnlyOpen = { open_issues_count: 15 };
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock).mockResolvedValueOnce(mockRepoDataOnlyOpen).mockResolvedValueOnce([]); // No closed issues
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1004);
  
    const result = await calculateResponsiveMaintainer(mockRepoURL);
  
    // Updated log expectations based on the actual implementation
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Starting Responsive Maintainer score calculation.', `Repository URL: ${mockRepoURL}`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Latency tracking started.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Constructed API link for repository data.', `API Link: ${mockRepoURL}`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Fetched repository and issues data successfully.']);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', [`Counted issues - Open: 0, Closed: 0`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Using open issues count from repoData.', `Open Issues Count: 15`]);
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated Responsive Maintainer score.', `Score: 0`]); // No closed issues, return zero score
    expect(logMessage).toHaveBeenCalledWith('calculateResponsiveMaintainer', ['Calculated fetch latency.', `Latency: 4.000 ms`]);
  
    expect(result.score).toEqual(0); // Score should be 0
    expect(result.latency).toEqual(4.0); // 4 ms latency
  });
});