export function getTimestampWithThreeDecimalPlaces(): number {
     // TODO: Add logfile handling
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const seconds = Math.floor(now.getTime() / 1000);
     // TODO: Add logfile handling

    return seconds + milliseconds / 1000;
}
