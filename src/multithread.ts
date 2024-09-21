import { cpus } from 'os';
import { logMessage } from './log_file';

export function getNumberOfCores(): number {
    logMessage('getNumberOfCores', ['Determining the number of CPU cores.', 'Starting to fetch CPU core count.']);
    
    const cores = cpus().length;

    logMessage('getNumberOfCores', [`Number of CPU cores: ${cores}`, 'Returning the core count.']);
    
    return cores;
}