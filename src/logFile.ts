import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Environment variables for the log file path and name
const logFilePath = process.env.LOG_FILE || path.join(__dirname, 'app.log');
const env_logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 0; 

// LogLevel enum for defining log severity levels
enum LogLevel {
    SILENT = 'SILENT',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

/**
 * Gets the user's timezone.
 *
 * @returns {string} The timezone string of the user's locale.
 */
function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Ensures that the log file exists; if it does not, creates it.
 */
function ensureLogFileExists() {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '', 'utf-8'); // Create an empty log file
    }
}

/**
 * Formats the current timestamp for log entries, including the timezone abbreviation.
 *
 * @returns {string} The formatted timestamp string.
 */
function formatTimestamp(): string {
    const now = new Date();
    const timezone = Intl.DateTimeFormat('en-US', {
        timeZone: getUserTimezone(),
        timeZoneName: 'short'
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value;

    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone: getUserTimezone(),
        hour12: false 
    };

    const dateParts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
    const year = dateParts.find(part => part.type === 'year')?.value;
    const month = dateParts.find(part => part.type === 'month')?.value.padStart(2, '0');
    const day = dateParts.find(part => part.type === 'day')?.value.padStart(2, '0');
    const hour = dateParts.find(part => part.type === 'hour')?.value.padStart(2, '0');
    const minute = dateParts.find(part => part.type === 'minute')?.value.padStart(2, '0');
    const second = dateParts.find(part => part.type === 'second')?.value.padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second} ${timezone}`;
    return formattedDate || ''; // Handle case where timezone is not found
}

/**
 * Writes a log entry to the log file.
 *
 * @param {string} component - The name of the component logging the message.
 * @param {string[]} messages - An array of messages; the first is the INFO message, and the second is the DEBUG message.
 */
export function logMessage(component: string, messages: string[]) {
    let log_message: string;
    let type: string;

    // Determine log level and corresponding message
    if (env_logLevel === 1) {
        log_message = messages[0];  // Set message to Info message
        type = 'INFO';
    } else {
        log_message = messages[1];  // Set message to Debug message
        type = 'DEBUG';
    }

    ensureLogFileExists();  // Ensure the log file exists before writing to it
    const timestamp = formatTimestamp(); // Get the formatted timestamp
    const logEntry = `[${timestamp}][${type}][${component}] ${log_message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8'); // Append the log entry to the file
}