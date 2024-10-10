import * as fs from 'fs';
import * as path from 'path';
import git from 'isomorphic-git';
import { getLicenseScore } from '../src/metrics/license';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

// Mock dependencies
jest.mock('isomorphic-git');
jest.mock('fs');
jest.mock('../src/metrics/getLatency');

describe('getLicenseScore', () => {
  const mockGitHubURL = 'https://github.com/example/repo';
  const mockRepoDir = './temp-repo';
  const mockLicensePath = path.join(mockRepoDir, 'LICENSE');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a score of 1 if a compatible license is present', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);
    
    // Mock the presence of a LICENSE file with a compatible license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('MIT License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // Score should be 1 as MIT is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(git.clone).toHaveBeenCalledWith({
      fs,
      http: expect.anything(),
      dir: mockRepoDir,
      url: 'https://example/repo',
      singleBranch: true,
      depth: 1
    });
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 0 if no LICENSE file is found', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the absence of a LICENSE file
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(0); // Score should be 0 as no LICENSE file is present
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(git.clone).toHaveBeenCalledWith({
      fs,
      http: expect.anything(),
      dir: mockRepoDir,
      url: 'https://example/repo',
      singleBranch: true,
      depth: 1
    });
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
  });

  it('should return a score of 0 if a LICENSE file has an incompatible license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with an incompatible license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Proprietary License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(0); // Score should be 0 as license is incompatible
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 1 for a GPL-2.0 license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);
    
    // Mock the presence of a LICENSE file with a GPL-2.0 license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('GPL-2.0 License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // GPL-2.0 is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 1 for a BSD-3-Clause license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with a BSD-3-Clause license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('BSD-3-Clause License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // BSD-3-Clause is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 1 for an Apache-2.0 license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with an Apache-2.0 license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Apache-2.0 License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // Apache-2.0 is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 1 for an LGPL-2.1-or-later license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with an LGPL-2.1-or-later license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('LGPL-2.1-or-later License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // LGPL-2.1-or-later is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should return a score of 1 for an MPL-1.1 license', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with an MPL-1.1 license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('MPL-1.1 License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValue(1000);

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // MPL-1.1 is a compatible license
    expect(latency).toEqual(0); // Latency is mocked to return 0 in this case
    expect(fs.existsSync).toHaveBeenCalledWith(mockLicensePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLicensePath, 'utf8');
  });

  it('should calculate the correct latency', async () => {
    // Mock git clone
    (git.clone as jest.Mock).mockResolvedValue(undefined);

    // Mock the presence of a LICENSE file with a compatible license
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('MIT License');

    // Mock timing functions
    (getTimestampWithThreeDecimalPlaces as jest.Mock)
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1005); // End time

    const { score, latency } = await getLicenseScore(mockGitHubURL);

    expect(score).toEqual(1); // License is compatible (MIT)
    expect(latency).toEqual(5); // Latency calculated as 1005 - 1000
  });
});
