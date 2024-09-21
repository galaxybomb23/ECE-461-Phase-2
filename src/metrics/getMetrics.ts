import { getBusFactor } from "./busFactor";
import { getLicenseScore } from "./license";
import { formatJSON, initJSON } from "../json";
import { url_type } from "../URL";
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
export async function get_metrics(URL: string): Promise<string> {
    logMessage('get_metrics', ['Initializing metrics calculation.', 'Starting to create empty JSON.']);
  
    let repo_data = initJSON(); // Initialize an empty JSON object for storing results
    logMessage('get_metrics', ['Empty JSON created.', 'Initialized repo_data.']);

    logMessage('get_metrics', ['Fetching number of cores.', 'Calling getNumberOfCores.']);
    let num_cores = getNumberOfCores(); // Get the number of processing cores available
    logMessage('get_metrics', ['Number of cores fetched.', `Cores: ${num_cores}`]);

    logMessage('get_metrics', ['Setting repository URL.', `URL: ${URL}`]);
    repo_data.URL = URL; // Store the original URL in the JSON object

    // Convert npmjs URL to Node.js API link if necessary
    if (url_type(URL) === "npmjs") {
        logMessage('get_metrics', ['Converting npmjs URL to Node.js API link.', `Original URL: ${URL}`]);
        URL = await getNodeJsAPILink(URL); // Fetch the Node.js API link
        logMessage('get_metrics', ['Converted npmjs URL.', `New URL: ${URL}`]);
    }

    logMessage('get_metrics', ['Calculating metrics concurrently.', 'Starting Promise.all for metrics.']);
    
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

    logMessage('get_metrics', ['Metrics calculation complete.', 'Storing results in repo_data.']);

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

    logMessage('get_metrics', ['Results stored.', 'Calculating Net Score and Latency.']);

    // Calculate the Net Score and its latency
    const netScore = await getNetScore(
        rampUpScore,
        correctnessScore,
        busFactorScore,
        responsiveMaintainerScore,
        licenseScore
    );

    logMessage('get_metrics', ['Net Score calculated.', `Net Score: ${netScore}`]);

    const netScore_Latency = await getNetScoreLatency(
        rampUpLatency,
        correctnessLatency,
        busFactorLatency,
        responsiveMaintainerLatency,
        licenseLatency
    );

    logMessage('get_metrics', ['Net Score Latency calculated.', `Net Score Latency: ${netScore_Latency}`]);

    // Store the Net Score and latency
    repo_data.NetScore = netScore;
    repo_data.NetScore_Latency = netScore_Latency;

    logMessage('get_metrics', ['Returning formatted JSON data.', 'Finalizing metrics response.']);
  
    return formatJSON(repo_data); // Return the formatted JSON string
}