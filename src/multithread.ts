import { cpus } from 'os';

export function getNumberOfCores(): number {
    // TODO: Add logfile handling
    const cores = cpus().length;
    // TODO: Add logfile handling
    return cores;
}