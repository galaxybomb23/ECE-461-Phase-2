import axios from 'axios';
//maintener

/**
 * Calculates the Responsive Maintainer score based on the recency of updates.
 * If the package has been updated within the last 6 months, give a higher score.
 * @param {any} packageData - The npm package data.
 * @param {string} fetchLatency - The latency of fetching the npm data.
 * @returns {number} The Responsive Maintainer score (0-1).
 */
export function calculateResponsiveMaintainer (openIssuesCount: number, closedIssuesCount: number,  fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

 

    const ratio = openIssuesCount / closedIssuesCount;
    const score = 1 / (1+ ratio);
    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round
    return { score, latency: totalLatencySec };
}

//maintainer