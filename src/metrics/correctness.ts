import axios from 'axios';

//correctness

/**
 * Calculates the Correctness score based on the number of open issues.
 * @param {number} openIssuesCount - The number of open GitHub issues.
 * @param {string} fetchLatency - The latency of fetching the npm data.
 * @returns {number} The Correctness score (0-1).
 */
export function calculateCorrectness(openIssuesCount: number, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

    const MAX_ISSUES = 1000; // Define a maximum reasonable number of issues
    const score = 1 - Math.min(openIssuesCount / MAX_ISSUES, 1);

    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round
    return { score, latency: totalLatencySec };
}

//end correctness