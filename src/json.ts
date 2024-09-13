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


export function formatJSON(data: DataObject): string {
    // Start string with "{"
    // For each element in the JSON, add the element name and value
    // End string with "}"

    return '';
}