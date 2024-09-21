import { exit } from "process";
import { fetchJsonFromApi } from "../API";
import { getGitHubAPILink } from "../github_data";
import { getBusFactor } from "./busFactor";
import { getLicenseScore } from "./license";
import { getTimestampWithThreeDecimalPlaces } from "./getLatency";
import { formatJSON, initJSON } from "../json";
import { url_type } from "../url";
import { getNodeJsAPILink } from "../nodejs_data";
import { calculateCorrectness } from "./correctness";
import { calculateRampUp } from "./rampUp";
import { calculateResponsiveMaintainer } from "./responsiveMaintainer";
import { getNetScore, getNetScoreLatency } from "./netScore";


export async function get_metrics(URL: string): Promise<string> {
  // Create Empty JSON
  let repo_data = initJSON();

  let metric_start = 0;
  let metric_end = 0;

  repo_data.URL = URL;

  if (url_type(URL) == "npmjs") {
      URL = await getNodeJsAPILink(URL);
  }

  // Calculate Bus Factor score and latency
  const { score: busFactorScore, latency: busFactorLatency } = await getBusFactor(URL);
  repo_data.BusFactor = busFactorScore;
  repo_data.BusFactor_Latency = busFactorLatency;

  // Calculate Correctness score and latency
  const { score: correctnessScore, latency: correctnessLatency } = await calculateCorrectness(URL);
  repo_data.Correctness = correctnessScore;
  repo_data.Correctness_Latency = correctnessLatency;

  // Calculate License score and latency
  const { score: licenseScore, latency: licenseLatency } = await getLicenseScore(URL);
  repo_data.License = licenseScore;
  repo_data.License_Latency = licenseLatency;

  // Calculate Ramp Up score and latency
  const { score: rampUpScore, latency: rampUpLatency } = await calculateRampUp(URL);
  repo_data.RampUp = rampUpScore;
  repo_data.RampUp_Latency = rampUpLatency;

  // Calculate Responsive Maintainer score and latency
  const { score: responsiveMaintainerScore, latency: responsiveMaintainerLatency } = await calculateResponsiveMaintainer(URL);
  repo_data.ResponsiveMaintainer = responsiveMaintainerScore;
  repo_data.ResponsiveMaintainer_Latency = responsiveMaintainerLatency;

  // Calculate Net Score and Latency
  const netScore = await getNetScore(
      rampUpScore,
      correctnessScore,
      busFactorScore,
      responsiveMaintainerScore,
      licenseScore
  );
  const netScore_Latency = await getNetScoreLatency(
      rampUpLatency,
      correctnessLatency,
      busFactorLatency,
      responsiveMaintainerLatency,
      licenseLatency
  );
  repo_data.NetScore = netScore;
  repo_data.NetScore_Latency = netScore_Latency;

  return formatJSON(repo_data);
}
