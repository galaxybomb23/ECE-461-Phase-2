import { cpus } from 'os';
import { logMessage } from './logFile';

/**
 * Retrieves the number of CPU cores available on the system.
 *
 * @returns {number} The count of CPU cores.
 */
export function getNumberOfCores(): number {
    logMessage('getNumberOfCores', ['Determining the number of CPU cores.', 'Starting to fetch CPU core count.']);

    // Fetch the number of CPU cores
    const cores = cpus().length;

    logMessage('getNumberOfCores', [`Number of CPU cores: ${cores}`, 'Returning the core count.']);

    return cores; // Return the count of CPU cores
}