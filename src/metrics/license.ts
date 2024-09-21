import { getGitHubAPILink } from "../github_data";
import { fetchJsonFromApi } from "../API";
import { getTimestampWithThreeDecimalPlaces } from "./getLatency";
import { logMessage } from '../log_file';

export async function getLicenseScore(URL: string): Promise<{ score: number, latency: number }> {
    logMessage('getLicenseScore', ['Starting license score calculation.', `URL: ${URL}`]);

    const latency_start = getTimestampWithThreeDecimalPlaces();
    logMessage('getLicenseScore', ['Latency tracking started.', `Start timestamp: ${latency_start}`]);

    // Fetch license data
    const API_link = getGitHubAPILink(URL, 'license'); // Adjust endpoint as needed
    logMessage('getLicenseScore', ['Constructed API link for license data.', `API link: ${API_link}`]);

    const license_data = await fetchJsonFromApi(API_link);
    logMessage('getLicenseScore', ['License data fetched successfully.', `License data: ${JSON.stringify(license_data)}`]);

    // Calculate license score
    let license_score = 0;
    if (license_data.license) {
        license_score = 1; // You can adjust this based on your criteria
        logMessage('getLicenseScore', ['License score calculated.', `Score: ${license_score}`]);
    } else {
        logMessage('getLicenseScore', ['No license found.', 'Score remains 0.']);
    }

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
    logMessage('getLicenseScore', ['Latency calculation complete.', `Latency: ${latencyMs} ms`]);

    return { score: license_score, latency: latencyMs };
}

// Sample Calls

// function calculateLicense() {
//     const link = "https://github.com/Miller11k/ECE-461"; // Replace with actual GitHub link
//     const link = "https://github.com/nodists/nodist"; // Replace with actual GitHub link
//     const API_link = getGitHubAPILink(link, "license");
//     fetchJsonFromApi(API_link)
//         .then((license_data) => {
//             const score = getLicence(license_data);
//             console.log("License score (License):", score);
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