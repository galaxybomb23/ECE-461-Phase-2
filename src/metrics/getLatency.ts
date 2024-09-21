import { logMessage } from './../log_file';

export function getTimestampWithThreeDecimalPlaces(): number {
    logMessage('getTimestampWithThreeDecimalPlaces', ['Getting current timestamp.', 'Starting to calculate timestamp.']);

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const seconds = Math.floor(now.getTime() / 1000);

    logMessage('getTimestampWithThreeDecimalPlaces', ['Timestamp calculated.', `Seconds: ${seconds}, Milliseconds: ${milliseconds}`]);

    return seconds + milliseconds / 1000;
}