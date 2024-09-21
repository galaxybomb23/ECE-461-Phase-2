import { logMessage } from '../logFile';

/**
 * Gets the current timestamp in seconds with three decimal places of precision.
 * 
 * @returns {number} The current timestamp in seconds.
 */
export function getTimestampWithThreeDecimalPlaces(): number {
    logMessage('getTimestampWithThreeDecimalPlaces', ['Getting current timestamp.', 'Starting to calculate timestamp.']);

    const now = new Date(); // Get the current date and time
    const milliseconds = now.getMilliseconds(); // Get the milliseconds part
    const seconds = Math.floor(now.getTime() / 1000); // Get the total seconds since the epoch

    logMessage('getTimestampWithThreeDecimalPlaces', ['Timestamp calculated.', `Seconds: ${seconds}, Milliseconds: ${milliseconds}`]);

    // Return the timestamp in seconds, including milliseconds as a fraction
    return seconds + milliseconds / 1000;
}