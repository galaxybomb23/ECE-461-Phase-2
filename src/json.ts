/**
 * Interface representing a data object used for storing repository metrics.
 * 
 * @interface DataObject
 * @typedef {DataObject}
 */
interface DataObject {
    URL: string;
    NetScore: number | null;
    NetScore_Latency: number | null;
    RampUp: number | null;
    RampUp_Latency: number | null;
    Correctness: number | null;
    Correctness_Latency: number | null;
    BusFactor: number | null;
    BusFactor_Latency: number | null;
    ResponsiveMaintainer: number | null;
    ResponsiveMaintainer_Latency: number | null;
    License: number | null;
    License_Latency: number | null;
}

/**
 * Initializes a DataObject for a given repository with all metrics set to null/empty.
 *
 * @returns {DataObject} An initialized DataObject with null metrics.
 */
export function initJSON(): DataObject {
    // Initialize the default data object with all fields set to null or empty strings.
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

    return defaultData;
}

/**
 * Converts a DataObject to a single-line JSON string with spaces between each metric.
 *
 * @param {DataObject} data - The DataObject to be formatted.
 * @returns {string} A single-line JSON string representation of the DataObject with spaces between metrics.
 */
export function formatJSON(data: DataObject): string {
    // Convert the DataObject to a JSON string.
    let jsonString = JSON.stringify(data); 

    // Add spaces after commas to separate metrics.
    jsonString = jsonString.replace(/,(?=\S)/g, ', '); 

    return jsonString;
}

// Sample Calls
// /**
//  * Main function to demonstrate the creation and formatting of a DataObject.
//  */
// function main() {
//     // Initialize an empty DataObject
//     const data: DataObject = initJSON();
    
//     // Format the DataObject into a single-line JSON string with spaces
//     const flattenedJson: string = formatJSON(data);
    
//     // Print the result
//     console.log(flattenedJson);
// }

// // Call the main function to run the example
// main();