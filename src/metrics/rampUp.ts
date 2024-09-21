import axios from 'axios';
 import * as fs from 'fs';

 function calculateRampUp(packageData: any, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing


    const MAX_SIZE = 5000000; // Arbitrary maximum package size
    let size = 0;

    // Check if unpackedSize is available under the latest version
    const latestVersion = packageData['dist-tags']?.latest;
    const latestVersionData = packageData.versions?.[latestVersion];

   

    if (latestVersionData && latestVersionData.dist && latestVersionData.dist.unpackedSize) {
        size = latestVersionData.dist.unpackedSize;
    } else {
        console.warn('Package size information not available. Using default size of 0.');
    }

    // Calculate score based on size (the smaller the package, the higher the score)
    const score = 1 - Math.min(size / MAX_SIZE, 1); // Ensure score is between 0 and 1
    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round

    return { score, latency: totalLatencySec };
}


/**
 * Calculates the RampUp score for GitHub repositories.
 * The smaller the repository size, the higher the score.
 * 
 * @param {any} packageData - The fetched GitHub repository data.
 * @param {string} fetchLatency - The latency in fetching the data.
 * @returns {{ score: number, latency: string }} - The RampUp score and latency.
 */
function calculateRampUpFromGitHub(packageData: any, fetchLatency: string): { score: number, latency: string } {
    const start = Date.now(); // Start timing

    const MAX_SIZE_KB = 50000; // Arbitrary maximum repo size in KB (50MB)
    let sizeInKb = packageData.size || 0; // Repo size in KB

    if (!sizeInKb) {
        console.warn('GitHub repository size information not available. Using default size of 0.');
    }

    // Calculate the score based on repository size
    const score = 1 - Math.min(sizeInKb / MAX_SIZE_KB, 1); // Score is inversely proportional to the repo size

    const latencyMs = Date.now() - start; // Calculate latency in milliseconds
    const totalLatencySec = ((latencyMs + Number(fetchLatency) * 1000) / 1000).toFixed(3); // Add fetchLatency and round

    return { score, latency: totalLatencySec };
}



/**
 * Main function to calculate RampUp score based on the package type (GitHub or npmjs).
 * 
 * @param {any} packageData - The fetched package data (either from npmjs or GitHub).
 * @param {string} fetchLatency - The latency in fetching the data.
 * @param {string} type - The type of package ('github' or 'npmjs').
 * @returns {{ score: number, latency: string }} - The RampUp score and latency.
 */
export function calculateRampUpMain(packageData: any, fetchLatency: string, type: string): { score: number, latency: string } {
    if (type === 'npmjs') {
        return calculateRampUp(packageData, fetchLatency); // Use npmjs RampUp calculation
    } else if (type === 'github') {
        return calculateRampUpFromGitHub(packageData, fetchLatency); // Use GitHub RampUp calculation
    } else {
        throw new Error('Invalid package type. Only "npmjs" or "github" are supported.');
    }
}
//end RAMP