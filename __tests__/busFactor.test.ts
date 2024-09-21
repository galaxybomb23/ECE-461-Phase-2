import { getBusFactor } from '../src/metrics/busFactor';
import { getContributionCounts } from '../src/github_data';

jest.mock('../src/github_data', () => ({
    getContributionCounts: jest.fn()
}));

describe('getBusFactor', () => {
    it('should return 0 if data length is 0', () => {
        const mockData: any[] = [];
        (getContributionCounts as jest.Mock).mockReturnValue([]);
        const expected = 0;
        const actual = getBusFactor(mockData);
        expect(actual).toEqual(expected);
    });

    it('should return correct Bus Factor for given data', () => {
        const mockData = [
            { commits: 50 },
            { commits: 30 },
            { commits: 20 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([50, 30, 20]);

        const expected = 0.3; // Adjust based on actual bus factor calculation
        const actual = getBusFactor(mockData);
        expect(actual).toBeCloseTo(expected, 1);
    });

    it('should handle single contributor correctly', () => {
        const mockData = [{ commits: 100 }];
        (getContributionCounts as jest.Mock).mockReturnValue([100]);

        const expected = 0; // Only one contributor, Bus Factor should be 0
        const actual = getBusFactor(mockData);
        expect(actual).toEqual(expected);
    });

    it('should handle multiple contributors with equal commits', () => {
        const mockData = [
            { commits: 10 },
            { commits: 10 },
            { commits: 10 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([10, 10, 10]);

        const expected = 0.7; // Bus Factor should reflect equal distribution
        const actual = getBusFactor(mockData);
        expect(actual).toBeCloseTo(expected, 1);
    });

    it('should handle contributors with varying commits', () => {
        const mockData = [
            { commits: 70 },
            { commits: 20 },
            { commits: 10 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([70, 20, 10]);

        const expected = 0.3; // Adjust based on actual bus factor calculation
        const actual = getBusFactor(mockData);
        expect(actual).toBeCloseTo(expected, 1);
    });

    it('should handle contributors with no commits', () => {
        const mockData = [
            { commits: 0 },
            { commits: 0 },
            { commits: 0 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([0, 0, 0]);

        const expected = 0; // No commits, Bus Factor should be 0
        const actual = getBusFactor(mockData);
        expect(actual).toEqual(expected);
    });

    it('should handle contributors with one having all commits', () => {
        const mockData = [
            { commits: 100 },
            { commits: 0 },
            { commits: 0 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([100, 0, 0]);

        const expected = 0; // One person does all the work, Bus Factor should be 0
        const actual = getBusFactor(mockData);
        expect(actual).toEqual(expected);
    });

    it('should handle contributors with decreasing commits', () => {
        const mockData = [
            { commits: 60 },
            { commits: 30 },
            { commits: 10 }
        ];
        (getContributionCounts as jest.Mock).mockReturnValue([60, 30, 10]);

        const expected = 0.3; // Adjust based on actual bus factor calculation
        const actual = getBusFactor(mockData);
        expect(actual).toBeCloseTo(expected, 1);
    });
});