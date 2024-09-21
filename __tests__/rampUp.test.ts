import { calculateRampUpMain } from '../src/metrics/rampUp';

describe('calculateRampUpMain', () => {
    it('should calculate the RampUp score for npmjs packages with size information', () => {
        const mockNpmPackageData = {
            'dist-tags': { latest: '1.0.0' },
            versions: {
                '1.0.0': { dist: { unpackedSize: 1000000 } } // 1MB
            }
        };

        const result = calculateRampUpMain(mockNpmPackageData, '0.5', 'npmjs');
        expect(result.score).toBeGreaterThan(0); // Expect a positive score
        expect(result.score).toBeLessThanOrEqual(1); // Score should be between 0 and 1
        expect(parseFloat(result.latency)).toBeCloseTo(0.506, 3); // Adjusted precision
    });

    it('should calculate the RampUp score for npmjs packages without size information', () => {
        const mockNpmPackageData = {
            'dist-tags': { latest: '1.0.0' },
            versions: {
                '1.0.0': {} // No size information
            }
        };

        console.warn = jest.fn(); // Spy on console.warn

        const result = calculateRampUpMain(mockNpmPackageData, '0.5', 'npmjs');
        expect(result.score).toEqual(1); // Default score when no size is provided
        expect(console.warn).toHaveBeenCalledWith('Package size information not available. Using default size of 0.');
    });

    it('should calculate the RampUp score for GitHub repositories with size information', () => {
        const mockGithubRepoData = {
            size: 10000 // 10MB in KB
        };

        const result = calculateRampUpMain(mockGithubRepoData, '0.2', 'github');
        expect(result.score).toBeGreaterThan(0); // Expect a positive score
        expect(result.score).toBeLessThanOrEqual(1); // Score should be between 0 and 1
        expect(parseFloat(result.latency)).toBeCloseTo(0.200, 3); // Ensure latency is calculated correctly
    });

    it('should calculate the RampUp score for GitHub repositories without size information', () => {
        const mockGithubRepoData = {};

        console.warn = jest.fn(); // Spy on console.warn

        const result = calculateRampUpMain(mockGithubRepoData, '0.5', 'github');
        expect(result.score).toEqual(1); // Default score when no size is provided
        expect(console.warn).toHaveBeenCalledWith('GitHub repository size information not available. Using default size of 0.');
    });

    it('should return a low score for large GitHub repositories', () => {
        const mockGithubRepoData = {
            size: 60000 // 60MB in KB (over the limit of 50MB)
        };

        const result = calculateRampUpMain(mockGithubRepoData, '1', 'github');
        expect(result.score).toEqual(0); // Expect a score of 0 for overly large repos
        expect(parseFloat(result.latency)).toBeCloseTo(1.000, 3); // Ensure latency is calculated correctly
    });

    it('should throw an error for unsupported package types', () => {
        const mockData = {};

        expect(() => calculateRampUpMain(mockData, '0.5', 'unsupported')).toThrowError(
            'Invalid package type. Only "npmjs" or "github" are supported.'
        );
    });
});