import { getGitHubAPILink } from "../github_data";
import { fetchJsonFromApi } from "../API";
import { getTimestampWithThreeDecimalPlaces } from "./getLatency";

export async function getLicenseScore(URL: string): Promise<{ score: number, latency: number }> {
     // TODO: Add logfile handling
    const latency_start = getTimestampWithThreeDecimalPlaces();
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // Fetch license data
    const API_link = getGitHubAPILink(URL, 'license'); // Adjust endpoint as needed
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    const license_data = await fetchJsonFromApi(API_link);
     // TODO: Add logfile handling


      // TODO: Add logfile handling
    // Calculate license score
    let license_score = 0;
    if (license_data.license) {
        license_score = 1; // You can adjust this based on your criteria
    }
     // TODO: Add logfile handling

      // TODO: Add logfile handling
    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
     // TODO: Add logfile handling
     
    return { score: license_score, latency: latencyMs };
}


// Sample Calls

// function calculateLicense() {
//     // const link = "https://github.com/Miller11k/ECE-461"; // Replace with actual GitHub link
//     const link = "https://github.com/nodists/nodist"; // Replace with actual GitHub link
//     const API_link = getGitHubAPILink(link, "license");
    // fetchJsonFromApi(API_link)
    //     .then((license_data) => {
    //         const score = getLicence(license_data);
    //         console.log("License score (License):", score);
    //     })
//         .catch((error: any) => {
//             if (error.response && error.response.status === 404) {
//                 // Handle 404 error silently
//                 console.warn("License data not found.");
//             } else {
//                 // Log general error message
//                 console.error("Error fetching license data:", error.message);
//             }
//         });
// }

// function calculateNoLicense() {
//     const link = "https://github.com/Miller11k/ECE-461"; // Replace with actual GitHub link
//     const API_link = getGitHubAPILink(link, "license");

//     fetchJsonFromApi(API_link)
//         .then((license_data) => {
//             const score = getLicence(license_data);
//             console.log("License score (No License):", score);
//         })
//         .catch((error: any) => {
//             if (error.response && error.response.status === 404) {
//                 // Handle 404 error silently
//                 console.warn("License data not found.");
//             } else {
//                 // Log general error message
//                 console.error("Error fetching license data:", error.message);
//             }
//         });
// }

// calculateLicense();
// calculateNoLicense();