import { getLicenseScore } from '../src/metrics/license';
import { fetchJsonFromApi } from '../src/API';
import { getGitHubAPILink } from '../src/githubData';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

// Mock dependencies
jest.mock('../src/API');
jest.mock('../src/githubData');
jest.mock('../src/metrics/getLatency');

describe('getLicenseScore', () => {
  const mockGitHubURL = 'https://github.com/example/repo';
  const mockAPIResponseWithLicense = { license: { name: 'MIT' } };
  const mockAPIResponseWithoutLicense = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a score of 1 if a license is present', async () => {
    // Mock the API call and other dependencies
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/license');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockAPIResponseWithLicense);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1);
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(getGitHubAPILink).toHaveBeenCalledWith(mockGitHubURL, 'license');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/license');
  });

  it('should return a score of 0 if no license is found', async () => {
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/license');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockAPIResponseWithoutLicense);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(0);
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(getGitHubAPILink).toHaveBeenCalledWith(mockGitHubURL, 'license');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/license');
  });

  it('should calculate the correct latency', async () => {
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/license');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockAPIResponseWithLicense);
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1005); // End time

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1);
    expect(latency).toEqual(5); // Latency calculated as 1005 - 1000
  });
});
