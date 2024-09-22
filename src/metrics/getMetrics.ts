import { getBusFactor } from "./busFactor";
import { getLicenseScore } from "./license";
import { formatJSON, initJSON } from "../json";
import { URLType } from "../URL";
import { getNodeJsAPILink } from "../npmjsData";
import { calculateCorrectness } from "./correctness";
import { calculateRampUp } from "./rampUp";
import { calculateResponsiveMaintainer } from "./responsiveMaintainer";
import { getNetScore, getNetScoreLatency } from "./netScore";
import { getNumberOfCores } from "../multithread";
import { logMessage } from '../logFile';

/**
 * Fetches and calculates various metrics for a given GitHub or npm repository URL.
 * 
 * @param {string} URL - The repository URL to analyze.
 * @returns {Promise<string>} A promise that resolves to a formatted JSON string containing the calculated metrics.
 */
export async function getMetrics(URL: string): Promise<string> {
    logMessage('getMetrics', ['Initializing metrics calculation.', 'Starting to create empty JSON.']);
  
    let repo_data = initJSON(); // Initialize an empty JSON object for storing results
    logMessage('getMetrics', ['Empty JSON created.', 'Initialized repo_data.']);

    logMessage('getMetrics', ['Fetching number of cores.', 'Calling getNumberOfCores.']);
    let num_cores = getNumberOfCores(); // Get the number of processing cores available
    logMessage('getMetrics', ['Number of cores fetched.', `Cores: ${num_cores}`]);

    logMessage('getMetrics', ['Setting repository URL.', `URL: ${URL}`]);
    repo_data.URL = URL; // Store the original URL in the JSON object

    // Convert npmjs URL to Node.js API link if necessary
    if (URLType(URL) === "npmjs") {
        logMessage('getMetrics', ['Converting npmjs URL to Node.js API link.', `Original URL: ${URL}`]);
        URL = await getNodeJsAPILink(URL); // Fetch the Node.js API link
        logMessage('getMetrics', ['Converted npmjs URL.', `New URL: ${URL}`]);
    }

    logMessage('getMetrics', ['Calculating metrics concurrently.', 'Starting Promise.all for metrics.']);
    
    // Fetch various metrics concurrently
    const [
        { score: busFactorScore, latency: busFactorLatency },
        { score: correctnessScore, latency: correctnessLatency },
        { score: licenseScore, latency: licenseLatency },
        { score: rampUpScore, latency: rampUpLatency },
        { score: responsiveMaintainerScore, latency: responsiveMaintainerLatency }
    ] = await Promise.all([
        getBusFactor(URL),
        calculateCorrectness(URL),
        getLicenseScore(URL),
        calculateRampUp(URL),
        calculateResponsiveMaintainer(URL)
    ]);

    logMessage('getMetrics', ['Metrics calculation complete.', 'Storing results in repo_data.']);

    // Store the calculated metrics and their latencies in the JSON object
    repo_data.BusFactor = busFactorScore;
    repo_data.BusFactor_Latency = busFactorLatency;
    repo_data.Correctness = correctnessScore;
    repo_data.Correctness_Latency = correctnessLatency;
    repo_data.License = licenseScore;
    repo_data.License_Latency = licenseLatency;
    repo_data.RampUp = rampUpScore;
    repo_data.RampUp_Latency = rampUpLatency;
    repo_data.ResponsiveMaintainer = responsiveMaintainerScore;
    repo_data.ResponsiveMaintainer_Latency = responsiveMaintainerLatency;

    logMessage('getMetrics', ['Results stored.', 'Calculating Net Score and Latency.']);

    // Calculate the Net Score and its latency
    const netScore = await getNetScore(
        rampUpScore,
        correctnessScore,
        busFactorScore,
        responsiveMaintainerScore,
        licenseScore
    );

    logMessage('getMetrics', ['Net Score calculated.', `Net Score: ${netScore}`]);

    const netScore_Latency = await getNetScoreLatency(
        rampUpLatency,
        correctnessLatency,
        busFactorLatency,
        responsiveMaintainerLatency,
        licenseLatency
    );

    logMessage('getMetrics', ['Net Score Latency calculated.', `Net Score Latency: ${netScore_Latency}`]);

    // Store the Net Score and latency
    repo_data.NetScore = netScore;
    repo_data.NetScore_Latency = netScore_Latency;

    logMessage('getMetrics', ['Returning formatted JSON data.', 'Finalizing metrics response.']);
  
    return formatJSON(repo_data); // Return the formatted JSON string
}