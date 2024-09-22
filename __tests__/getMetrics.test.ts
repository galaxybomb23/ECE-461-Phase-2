import { get_metrics } from '../src/metrics/getMetrics';
import { getBusFactor } from '../src/metrics/busFactor';
import { getLicenseScore } from '../src/metrics/license';
import { calculateCorrectness } from '../src/metrics/correctness';
import { calculateRampUp } from '../src/metrics/rampUp';
import { calculateResponsiveMaintainer } from '../src/metrics/responsiveMaintainer';
import { getNetScore, getNetScoreLatency } from '../src/metrics/netScore';
import { getNumberOfCores } from '../src/multithread';
import { logMessage } from '../src/logFile';
import { formatJSON, initJSON } from '../src/json';
import { getNodeJsAPILink } from '../src/npmjsData';
import { url_type } from '../src/URL';

// Mock all dependencies
jest.mock('../src/busFactor', () => ({ getBusFactor: jest.fn() }));
jest.mock('../src/license', () => ({ getLicenseScore: jest.fn() }));
jest.mock('../src/correctness', () => ({ calculateCorrectness: jest.fn() }));
jest.mock('../src/rampUp', () => ({ calculateRampUp: jest.fn() }));
jest.mock('../src/responsiveMaintainer', () => ({ calculateResponsiveMaintainer: jest.fn() }));
jest.mock('../src/netScore', () => ({
  getNetScore: jest.fn(),
  getNetScoreLatency: jest.fn(),
}));
jest.mock('../src/multithread', () => ({ getNumberOfCores: jest.fn() }));
jest.mock('../src/logFile', () => ({ logMessage: jest.fn() }));
jest.mock('../src/json', () => ({
  formatJSON: jest.fn(),
  initJSON: jest.fn(),
}));
jest.mock('../src/npmjsData', () => ({ getNodeJsAPILink: jest.fn() }));
jest.mock('../src/URL', () => ({ url_type: jest.fn() }));

describe('get_metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch metrics and return formatted JSON for a given URL', async () => {
    const mockURL = 'https://github.com/cloudinary/cloudinary_npm';
    const mockRepoData = {
      URL: mockURL,
      BusFactor: 5,
      BusFactor_Latency: 200,
      Correctness: 4,
      Correctness_Latency: 150,
      License: 3,
      License_Latency: 100,
      RampUp: 4,
      RampUp_Latency: 100,
      ResponsiveMaintainer: 5,
      ResponsiveMaintainer_Latency: 250,
      NetScore: 4.2,
      NetScore_Latency: 200,
    };

    // Mock the return values of the functions
    (initJSON as jest.Mock).mockReturnValue(mockRepoData);
    (getNumberOfCores as jest.Mock).mockReturnValue(8);
    (url_type as jest.Mock).mockReturnValue('github');
    (getBusFactor as jest.Mock).mockResolvedValue({ score: 5, latency: 200 });
    (calculateCorrectness as jest.Mock).mockResolvedValue({ score: 4, latency: 150 });
    (getLicenseScore as jest.Mock).mockResolvedValue({ score: 3, latency: 100 });
    (calculateRampUp as jest.Mock).mockResolvedValue({ score: 4, latency: 100 });
    (calculateResponsiveMaintainer as jest.Mock).mockResolvedValue({ score: 5, latency: 250 });
    (getNetScore as jest.Mock).mockResolvedValue(4.2);
    (getNetScoreLatency as jest.Mock).mockResolvedValue(200);
    (formatJSON as jest.Mock).mockReturnValue(JSON.stringify(mockRepoData));

    const result = await get_metrics(mockURL);

    // Check if metrics and latencies are correctly fetched
    expect(getBusFactor).toHaveBeenCalledWith(mockURL);
    expect(calculateCorrectness).toHaveBeenCalledWith(mockURL);
    expect(getLicenseScore).toHaveBeenCalledWith(mockURL);
    expect(calculateRampUp).toHaveBeenCalledWith(mockURL);
    expect(calculateResponsiveMaintainer).toHaveBeenCalledWith(mockURL);

    // Check if Net Score calculation is correct
    expect(getNetScore).toHaveBeenCalledWith(4, 4, 5, 5, 3);
    expect(getNetScoreLatency).toHaveBeenCalledWith(100, 150, 200, 250, 100);

    // Check if formatJSON is called with the correct data
    expect(formatJSON).toHaveBeenCalledWith(mockRepoData);

    // Check the final result
    expect(result).toEqual(JSON.stringify(mockRepoData));
  });

  it('should convert npmjs URL and fetch Node.js API link', async () => {
    const npmURL = 'https://www.npmjs.com/package/example';
    const nodeJsApiLink = 'https://api.nodejs.org/example';

    (url_type as jest.Mock).mockReturnValue('npmjs');
    (getNodeJsAPILink as jest.Mock).mockResolvedValue(nodeJsApiLink);
    (initJSON as jest.Mock).mockReturnValue({ URL: npmURL });

    await get_metrics(npmURL);

    // Check if npm URL is converted to Node.js API link
    expect(getNodeJsAPILink).toHaveBeenCalledWith(npmURL);
  });
});