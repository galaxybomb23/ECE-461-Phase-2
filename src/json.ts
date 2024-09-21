import { logMessage } from "./logFile";

/**
 * Interface representing a data object used for storing repository metrics.
 * 
 * @interface DataObject
 */
interface DataObject {
    URL: string;                                    // The URL of the repository
    NetScore: number | null;                        // Overall net score of the repository
    NetScore_Latency: number | null;                // Latency for net score
    RampUp: number | null;                          // Ramp-up metric
    RampUp_Latency: number | null;                  // Latency for ramp-up metric
    Correctness: number | null;                     // Correctness metric
    Correctness_Latency: number | null;             // Latency for correctness metric
    BusFactor: number | null;                       // Bus factor metric
    BusFactor_Latency: number | null;               // Latency for bus factor metric
    ResponsiveMaintainer: number | null;            // Responsive maintainer score
    ResponsiveMaintainer_Latency: number | null;    // Latency for responsive maintainer score
    License: number | null;                         // License metric
    License_Latency: number | null;                 // Latency for license metric
}

/**
 * Initializes a DataObject for a given repository with all metrics set to null/empty.
 *
 * @returns {DataObject} An initialized DataObject with null metrics.
 */
export function initJSON(): DataObject {
    logMessage('initJSON - Start', ['Initializing DataObject with null metrics.', 'Creating default metrics object.']);
    
    const defaultData: DataObject = {
        URL: '',
        NetScore: null,
        NetScore_Latency: null,
        RampUp: null,
        RampUp_Latency: null,
        Correctness: null,
        Correctness_Latency: null,
        BusFactor: null,
        BusFactor_Latency: null,
        ResponsiveMaintainer: null,
        ResponsiveMaintainer_Latency: null,
        License: null,
        License_Latency: null
    };
    
    logMessage('initJSON - Complete', ['DataObject initialized successfully.', JSON.stringify(defaultData)]);
    return defaultData;
}

/**
 * Converts a DataObject to a single-line JSON string with spaces between each metric.
 *
 * @param {DataObject} data - The DataObject to be formatted.
 * @returns {string} A single-line JSON string representation of the DataObject with spaces between metrics.
 */
export function formatJSON(data: DataObject): string {
    logMessage('formatJSON - Start', ['Formatting DataObject to JSON string.', `DataObject: ${JSON.stringify(data)}`]);
    
    let jsonString = JSON.stringify(data);
    logMessage('formatJSON - JSON String Created', ['Initial JSON string created.', jsonString]);

    // Add spaces after commas for better readability
    jsonString = jsonString.replace(/,(?=\S)/g, ', ');
    logMessage('formatJSON - Spaces Added', ['Formatted JSON string with spaces.', jsonString]);

    return jsonString;
}

/**
 * Extracts the GitHub issues URL (bugs.url) from any version of the package JSON data.
 *
 * @param {any} packageData - The package JSON data.
 * @returns {string | null} The GitHub issues URL if found, or null if not found.
 */
export function extractLastIssuesUrlFromJson(packageData: any): string | null {
    logMessage('extractLastIssuesUrlFromJson - Start', ['Extracting issues URL from package data.', `Package Data: ${JSON.stringify(packageData)}`]);

    const versions = packageData.versions;
    let lastIssuesUrl: string | null = null;

    // Iterate through versions to find the last issues URL
    for (const version in versions) {
        if (versions.hasOwnProperty(version)) {
            const versionData = versions[version];
            if (versionData.bugs && versionData.bugs.url) {
                lastIssuesUrl = versionData.bugs.url;  // Update to the latest found bugs.url
                logMessage('extractLastIssuesUrlFromJson - Issues URL Found', [`Found issues URL for version ${version}: ${lastIssuesUrl}`, 'Continuing to check for more versions.']);
            }
        }
    }

    if (lastIssuesUrl) {
        logMessage('extractLastIssuesUrlFromJson - URL Found', ['Returning last found issues URL.', `URL: ${lastIssuesUrl}`]);
        return lastIssuesUrl;
    } else {
        logMessage('extractLastIssuesUrlFromJson - No URL Found', ['No GitHub issues URL found in any version.', 'Returning null.']);
        return null;
    }
}