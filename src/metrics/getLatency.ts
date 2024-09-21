export function getTimestampWithThreeDecimalPlaces(): number {
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const seconds = Math.floor(now.getTime() / 1000);

    return seconds + milliseconds / 1000;
}
