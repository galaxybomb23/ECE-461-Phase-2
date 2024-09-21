import { getBusFactor } from "./busFactor";
import { getLicenseScore } from "./license";
import { formatJSON, initJSON } from "../json";
import { url_type } from "../url";
import { getNodeJsAPILink } from "../nodejs_data";
import { calculateCorrectness } from "./correctness";
import { calculateRampUp } from "./rampUp";
import { calculateResponsiveMaintainer } from "./responsiveMaintainer";
import { getNetScore, getNetScoreLatency } from "./netScore";
import { getNumberOfCores } from "../multithread";
import { logMessage } from '../log_file';

export async function get_metrics(URL: string): Promise<string> {
  logMessage('get_metrics', ['Initializing metrics calculation.', 'Starting to create empty JSON.']);
  
  let repo_data = initJSON();
  logMessage('get_metrics', ['Empty JSON created.', 'Initialized repo_data.']);

  logMessage('get_metrics', ['Fetching number of cores.', 'Calling getNumberOfCores.']);
  let num_cores = getNumberOfCores();
  logMessage('get_metrics', ['Number of cores fetched.', `Cores: ${num_cores}`]);

  logMessage('get_metrics', ['Setting repository URL.', `URL: ${URL}`]);
  repo_data.URL = URL;

  if (url_type(URL) === "npmjs") {
    logMessage('get_metrics', ['Converting npmjs URL to Node.js API link.', `Original URL: ${URL}`]);
    URL = await getNodeJsAPILink(URL);
    logMessage('get_metrics', ['Converted npmjs URL.', `New URL: ${URL}`]);
  }

  logMessage('get_metrics', ['Calculating metrics concurrently.', 'Starting Promise.all for metrics.']);
  
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

  repo_data.NetScore = netScore;
  repo_data.NetScore_Latency = netScore_Latency;

  logMessage('get_metrics', ['Returning formatted JSON data.', 'Finalizing metrics response.']);
  
  return formatJSON(repo_data);
}