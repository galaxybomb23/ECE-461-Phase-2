import { getNumberOfCores } from '../src/multithread';
import { cpus } from 'os';
import { logMessage } from '../src/logFile';

// Mock the 'os' module and 'logMessage' function
jest.mock('os');
jest.mock('../src/logFile');

describe('getNumberOfCores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct number of CPU cores and log the messages', () => {
    // Mock the cpus function to return a mock list of CPU cores
    const mockCores = [{}, {}, {}, {}]; // Simulate 4 CPU cores
    (cpus as jest.Mock).mockReturnValue(mockCores);

    const result = getNumberOfCores();

    // Check that logMessage was called with the correct messages
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', ['Determining the number of CPU cores.', 'Starting to fetch CPU core count.']);
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', [`Number of CPU cores: 4`, 'Returning the core count.']);

    // Ensure the number of CPU cores is correctly returned
    expect(result).toEqual(4);
  });

  it('should handle edge cases when cpus function returns an empty array', () => {
    // Mock the cpus function to return an empty array (no CPU cores)
    (cpus as jest.Mock).mockReturnValue([]);

    const result = getNumberOfCores();

    // Ensure logMessage is called correctly
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', ['Determining the number of CPU cores.', 'Starting to fetch CPU core count.']);
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', ['Number of CPU cores: 0', 'Returning the core count.']);

    // Check that the number of CPU cores is 0
    expect(result).toEqual(0);
  });

  it('should return the correct number of CPU cores when cpus function returns more than expected', () => {
    // Simulate a scenario with 8 cores
    const mockCores = [{}, {}, {}, {}, {}, {}, {}, {}]; // Simulate 8 CPU cores
    (cpus as jest.Mock).mockReturnValue(mockCores);

    const result = getNumberOfCores();

    // Ensure logging is done correctly
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', ['Determining the number of CPU cores.', 'Starting to fetch CPU core count.']);
    expect(logMessage).toHaveBeenCalledWith('getNumberOfCores', [`Number of CPU cores: 8`, 'Returning the core count.']);

    // Check the result for 8 CPU cores
    expect(result).toEqual(8);
  });
});