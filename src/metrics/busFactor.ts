import { getGitHubAPILink, getContributionCounts } from './../github_data';
import { fetchJsonFromApi } from './../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';

/**
 * Calculates the Bus Factor of a repository based on the contribution distribution.
 * The Bus Factor represents the minimum number of key contributors required
 * to maintain the project, relative to the total number of contributors.
 * 
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number, latency: number }>} - The calculated Bus Factor and latency.
 */
export async function getBusFactor(URL: string): Promise<{ score: number, latency: number }> {
  const latency_start = getTimestampWithThreeDecimalPlaces();
  let data = await fetchJsonFromApi(getGitHubAPILink(URL, "contributors"));

  if (data.length === 0) { // Check if no contributor data
    // Calculate latency in milliseconds
  const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
    return { score: 0, latency: latencyMs }; // Change here
  }

  let threshold = 0.95;   // Define a threshold for % critical for project maintenance
  let num_committers = data.length; // Get number of contributors in repo

  let commit_count = getContributionCounts(data); // Get array of commit counts

  let total_commits = commit_count.reduce((sum, count) => sum + count, 0); // Sum all commit counts

  let current_percentage = 0.0; // Start current commit percentage at 0
  let i = 0;  // Reset i to 0

  // Get inverse Bus Factor (How many people need to be working to notice no change)
  while (current_percentage < threshold && i < num_committers) {  // While threshold not hit and still more committers
    current_percentage += (commit_count[i] / total_commits); // Add each contributor's contribution percentage
    i++; // Move to the next contributor
  }

  let bus_factor = 1 - (i / num_committers);  // Calculate Bus Factor from Inverse
  bus_factor = Math.round(bus_factor * 10) / 10; // Round to nearest tenth

  // Calculate latency in milliseconds
  const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));

  return { score: bus_factor, latency: latencyMs }; // Change here
}


// Sample Calls
// async function calculateBusFactor1() {
  // try {
  //   let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/lodash/lodash", "contributors"));
  //   let bus_factor = getBusFactor(data);
  //   console.log(`Bus Factor Lodash: ${bus_factor}`);
  // } catch (error) {
  //   console.error('Error fetching data:', error);
  // }
// }

// async function calculateBusFactor2() {
//   try {
//     let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/cloudinary/cloudinary_npm", "contributors"));
//     let bus_factor = getBusFactor(data);
//     console.log(`Bus Factor Cloudinary_NPM: ${bus_factor}`);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// }

// async function calculateBusFactor3() {
//   try {
//     let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/nullivex/nodist", "contributors"));
//     let bus_factor = getBusFactor(data);
//     console.log(`Bus Factor Nodist: ${bus_factor}`);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// }

// calculateBusFactor1();
// calculateBusFactor2();
// calculateBusFactor3();
