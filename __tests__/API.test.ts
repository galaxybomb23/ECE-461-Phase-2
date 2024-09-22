import axios from 'axios';
import { fetchJsonFromApi } from '../src/API';
import { logMessage } from '../src/logFile';
import * as dotenv from 'dotenv';

// Mock external dependencies
jest.mock('axios');
jest.mock('../src/logFile');
jest.mock('dotenv');

describe('fetchJsonFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (dotenv.config as jest.Mock).mockReturnValue({}); // Mock dotenv.config
  });

  it('should fetch JSON data successfully and log the process', async () => {
    const apiLink = 'https://api.github.com/repos/example/repo';
    const mockResponse = { data: { id: 123, name: 'example-repo' } };
    
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    process.env.GITHUB_TOKEN = 'mocked_token'; // Simulate presence of GITHUB_TOKEN

    const result = await fetchJsonFromApi(apiLink);

    // Assert that the response is returned correctly
    expect(result).toEqual(mockResponse.data);

    // Ensure axios was called with correct headers
    expect(axios.get).toHaveBeenCalledWith(apiLink, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token mocked_token`,
      },
    });

    // Ensure logMessage was called correctly
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Start', [
      'Preparing to fetch JSON data from the API.',
      `API link: ${apiLink}`,
    ]);
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Authorization', [
      'Authorization token added to headers.',
      'Token present and attached to request headers.',
    ]);
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Sending Request', [
      'Sending GET request to the API.',
      `Requesting data from: ${apiLink}`,
    ]);
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Response Received', [
      'Successfully received data from the API.',
      'Data successfully fetched and returned as JSON.',
    ]);
  });

  it('should log and handle errors for the license endpoint and return an empty object', async () => {
    const apiLink = 'https://api.github.com/repos/example/repo/license';
    const mockError = new Error('Request failed');
    
    (axios.get as jest.Mock).mockRejectedValue(mockError);
    
    const result = await fetchJsonFromApi(apiLink);

    // Assert that an empty object is returned when an error occurs for license endpoint
    expect(result).toEqual({});

    // Ensure logMessage was called correctly
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Error', [
      'Error occurred during the API request.',
      `Error message: ${mockError.message}`,
    ]);
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - License Error', [
      'Returning empty object due to error on the license endpoint.',
      'No data found or the request failed.',
    ]);
  });

  it('should throw an error for non-license endpoints when the request fails', async () => {
    const apiLink = 'https://api.github.com/repos/example/repo';
    const mockError = new Error('Request failed');
    
    (axios.get as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchJsonFromApi(apiLink)).rejects.toThrow(`API request failed: ${mockError.message}`);

    // Ensure logMessage was called correctly for the error
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Error', [
      'Error occurred during the API request.',
      `Error message: ${mockError.message}`,
    ]);
  });

  it('should fetch without Authorization header when GITHUB_TOKEN is not available', async () => {
    const apiLink = 'https://api.github.com/repos/example/repo';
    const mockResponse = { data: { id: 123, name: 'example-repo' } };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    process.env.GITHUB_TOKEN = ''; // Simulate absence of GITHUB_TOKEN

    const result = await fetchJsonFromApi(apiLink);

    // Assert that the response is returned correctly
    expect(result).toEqual(mockResponse.data);

    // Ensure axios was called with correct headers without Authorization
    expect(axios.get).toHaveBeenCalledWith(apiLink, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    // Ensure logMessage was called correctly
    expect(logMessage).toHaveBeenCalledWith('fetchJsonFromApi - Authorization', [
      'No authorization token found.',
      'Proceeding without authorization token.',
    ]);
  });
});