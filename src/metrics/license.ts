import { getGitHubAPILink } from "../github_data";
import { fetchJsonFromApi } from "../API";

export function getLicence(license_data: any): number {
    let license_score = 0;
    if (license_data.license) {
        license_score = 1;
    }
    // Here you can process `license_data` to calculate `license_score` if needed.
    return license_score;
}


// Sample Calls

// function calculateLicense() {
//     // const link = "https://github.com/Miller11k/ECE-461"; // Replace with actual GitHub link
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
