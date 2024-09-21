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

export async function get_metrics(URL: string): Promise<string> {
  // TODO: Add logfile handling
  // Create Empty JSON
  let repo_data = initJSON();
   // TODO: Add logfile handling

  // TODO: Add logfile handling
  let num_cores = getNumberOfCores();
  // TODO: Add logfile handling

  // TODO: Add logfile handling
  repo_data.URL = URL;
  // TODO: Add logfile handling

   // TODO: Add logfile handling
  if (url_type(URL) == "npmjs") {
    URL = await getNodeJsAPILink(URL);
  }
   // TODO: Add logfile handling

  // TODO: Add logfile handling
  // Use Promise.all to run the metric calculations concurrently
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
   // TODO: Add logfile handling


   // TODO: Add logfile handling
  // Store the results in the repo_data object
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
   // TODO: Add logfile handling


   // TODO: Add logfile handling
  // Calculate Net Score and Latency
  const netScore = await getNetScore(
    rampUpScore,
    correctnessScore,
    busFactorScore,
    responsiveMaintainerScore,
    licenseScore
  );
   // TODO: Add logfile handling

  // TODO: Add logfile handling
  const netScore_Latency = await getNetScoreLatency(
    rampUpLatency,
    correctnessLatency,
    busFactorLatency,
    responsiveMaintainerLatency,
    licenseLatency
  );
   // TODO: Add logfile handling

    // TODO: Add logfile handling
  repo_data.NetScore = netScore;
  repo_data.NetScore_Latency = netScore_Latency;
   // TODO: Add logfile handling
  return formatJSON(repo_data);
}