import { getLicenseScore } from '../src/metrics/license';

describe('getLicense', () => {
  it('should return 1 if license is present', async () => {
    const URL = "https://github.com/some/repo"; // Replace with actual URL
    const mockFetch = jest.fn().mockResolvedValue({ license: "MIT" });
    global.fetch = mockFetch;

    const expected = 1;
    const { score: actual } = await getLicenseScore(URL);
    expect(actual).toEqual(expected);
  });

  it('should return 0 if license is not present', async () => {
    const URL = "https://github.com/some/repo"; // Replace with actual URL
    const mockFetch = jest.fn().mockResolvedValue({ license: null });
    global.fetch = mockFetch;

    const expected = 0;
    const { score: actual } = await getLicenseScore(URL);
    expect(actual).toEqual(expected);
  });
});