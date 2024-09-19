import { getGitHubAPILink } from "../github_data";
import { fetchJsonFromApi } from "../API";

export async function getLicence(link: string): Promise<number> {
    let license_score = 0;

    let API_link = getGitHubAPILink(link, "license");

    try {
        let license_data = await fetchJsonFromApi(API_link);
        console.log(license_data);

        // Here you can process `license_data` to calculate `license_score` if needed.
    } catch (error) {
        console.error("Error fetching license data:", error);
    }

    return license_score;
}

async function main() {
    const link = "https://github.com/nodists/nodist"; // Replace with actual GitHub link
    const score = await getLicence(link);
    console.log("License score:", score);
}

main();