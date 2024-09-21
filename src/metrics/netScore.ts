import { getTimestampWithThreeDecimalPlaces } from "./getLatency";

/**
 * Calculates the net score based on various metrics.
 * 
 * The score is calculated using weighted contributions from ramp-up time, 
 * correctness, bus factor, responsive maintainer score, and license score.
 *
 * @export
 * @param {number} ramp_up_time - Calclated Ramp Up Time Score
 * @param {number} correctness - Calculated Correctness Score
 * @param {number} bus_factor - Calculated Bus Factor
 * @param {number} responsive_maintainer - Responsive Maintainer Score
 * @param {number} license - Calculated License Score
 * @returns {number} - The calculated net score.
 */
export async function getNetScore(ramp_up_time: number, correctness: number, bus_factor: number, responsive_maintainer: number, license: number): Promise<number> {

    // Initialize net score to zero
    let net_score = 0;

    net_score += (0.2) * license;   // Add weighted License score (25%)
    net_score += (0.25) * bus_factor;   // Add weighted Bus Factor Score
    net_score += (0.25) * responsive_maintainer;    // Add weighted Responsive Maintainer Score (25%)
    net_score += (0.2) * correctness;   // Add weighted correctness score (20%)
    net_score += (0.1) * ramp_up_time;  // Add weighted Ramp-Up Time score (10%)

    net_score = parseFloat((net_score).toFixed(1));

    return (net_score);
}

export async function getNetScoreLatency(
    ramp_up_latency: number,
    correctness_latency: number,
    bus_factor_latency: number,
    responsive_maintainer_latency: number,
    license_latency: number
): Promise<number> {
    let netScore_Latency = ramp_up_latency + correctness_latency + bus_factor_latency + responsive_maintainer_latency + license_latency;

    netScore_Latency = parseFloat((netScore_Latency).toFixed(1));
    
    return(netScore_Latency);
}
