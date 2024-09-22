import { getNodeJsAPILink } from '../src/npmjsData';
import { fetchJsonFromApi } from './../src/API';

jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));
describe('getNodeJsAPILink', () => {
  it('should fetch npm data and extract GitHub repository link', async () => {
    const mockNpmData = {
      repository: {
        url: 'git+ssh://git@github.com/browserify/browserify.git',
      },
    };
  
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);
    
    // Spy on logMessage instead of console.log
    const logMessageSpy = jest.spyOn(require('../src/logFile'), 'logMessage').mockImplementation();
  
    await getNodeJsAPILink('https://www.npmjs.com/package/browserify');
  
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://registry.npmjs.org/browserify');
    
    // Check the log messages instead of console.log
    expect(logMessageSpy).toHaveBeenCalledWith('getNodeJsAPILink', ['Returning cleaned GitHub repository URL.', 'https://github.com/browserify/browserify']);
    
    logMessageSpy.mockRestore();
  });
  it('should handle missing repository link gracefully', async () => {
    const mockNpmData = {};
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);
    
    const logMessageSpy = jest.spyOn(require('../src/logFile'), 'logMessage').mockImplementation();
  
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');
    
    // Ensure the log message for missing repository link
    expect(logMessageSpy).toHaveBeenCalledWith('getNodeJsAPILink', ['No GitHub repository link found or data is incomplete.', 'Returning empty string.']);
    
    logMessageSpy.mockRestore();
  });
  it('should log an error if the API call fails', async () => {
    const mockError = new Error('API request failed');
    (fetchJsonFromApi as jest.Mock).mockRejectedValue(mockError);
  
    const logMessageSpy = jest.spyOn(require('../src/logFile'), 'logMessage').mockImplementation();
  
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');
    
    // Ensure the error is logged using logMessage
    expect(logMessageSpy).toHaveBeenCalledWith('getNodeJsAPILink', ['Error fetching data from npm API.', `Error: ${mockError}`]);
  
    logMessageSpy.mockRestore();
  });
});