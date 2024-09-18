import { getNodeJsAPILink } from '../src/nodejs_data';
import { fetchJsonFromApi } from '../src/API';
jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));
describe('getNodeJsAPILink', () => {
  it('should fetch npm data and extract GitHub repository link', async () => {
    // Mocking a proper response structure from the API
    const mockNpmData = {
      repository: {
        url: 'git+ssh://git@github.com/browserify/browserify.git',
      },
    };
    // Set up the mock to resolve with this data
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);
    // Spy on console.log to capture log outputs
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    // Call the function being tested
    await getNodeJsAPILink('https://www.npmjs.com/package/browserify');
    // Check if the API fetch function was called with the correct URL
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://registry.npmjs.org/browserify');
    // Ensure the correct GitHub URL is logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Clean GitHub Repository URL:',
      'https://github.com/browserify/browserify'
    );
    // Additional assertion for fetching the npm data
    expect(consoleLogSpy).toHaveBeenCalledWith('Repository URL from npm Data:', mockNpmData);
    // Clean up the console log spy
    consoleLogSpy.mockRestore();
  });
  it('should handle missing repository link gracefully', async () => {
    // Mocking a response with no repository field
    const mockNpmData = {};
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');
    // Ensure the error is logged when no repository link is found
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'No GitHub repository link found or data is incomplete.'
    );
    consoleErrorSpy.mockRestore();
  });
  it('should log an error if the API call fails', async () => {
    // Mocking the API to throw an error
    const mockError = new Error('API request failed');
    (fetchJsonFromApi as jest.Mock).mockRejectedValue(mockError);
  
    // Spy on console.error to capture error outputs
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    // Call the function being tested
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');
  
    // Ensure the error is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data from npm API:', mockError);
  
    // Clean up the console error spy
    consoleErrorSpy.mockRestore();
  });
});