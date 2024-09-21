import { getContributionCounts, getGitHubAPILink } from '../src/githubData';
import { fetchJsonFromApi } from '../src/API';

jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));

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