import { calculateResponsiveMaintainer } from '../src/metrics/responsiveMaintainer';

describe('calculateResponsiveMaintainer', () => {
    it('should return a perfect score of 1 when there are no open issues', () => {
        const result = calculateResponsiveMaintainer(0, 10, '0.5');
        expect(result.score).toEqual(1); // A perfect score when open issues are 0
        expect(result.latency).toEqual('0.500'); // Compare latency as a string
    });

    it('should return a low score when there are many more open issues than closed issues', () => {
        const result = calculateResponsiveMaintainer(100, 10, '0.5');
        expect(result.score).toBeLessThan(0.1); // Expect a low score when open issues are much higher than closed
        expect(result.latency).toEqual('0.500'); // Compare latency as a string
    });

    it('should return a reasonable score when open and closed issues are equal', () => {
        const result = calculateResponsiveMaintainer(10, 10, '0.5');
        expect(result.score).toEqual(0.5); // Expect a score of 0.5 when open and closed issues are equal
        expect(result.latency).toEqual('0.500'); // Compare latency as a string
    });

    it('should handle very large latency values correctly', () => {
        const result = calculateResponsiveMaintainer(5, 10, '5');
        expect(result.score).toBeGreaterThan(0.5); // Score should still be reasonable with large latency
        expect(result.latency).toEqual('5.000'); // Compare latency as a string
    });

    it('should return a score of 0 if closed issues are 0 to avoid division by zero', () => {
        const result = calculateResponsiveMaintainer(10, 0, '0.5');
        expect(result.score).toEqual(0); // Should return 0 score if there are no closed issues
        expect(result.latency).toEqual('0.500'); // Compare latency as a string
    });
});