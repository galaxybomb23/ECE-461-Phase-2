
import * as fs from 'fs';
import * as path from 'path';

// Environment variables for the log file path and name
const logFilePath = process.env.LOG_FILE || path.join(__dirname, 'app.log');

// LogLevel enum for defining log severity levels
enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL'
}

// Function to ensure the log file exists, if not, create it
function ensureLogFileExists() {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '', 'utf-8');
    }
}

// Function to format the current timestamp for log entries
function formatTimestamp(): string {
    return new Date().toISOString();  // Returns the timestamp in ISO format with UTC timezone
}

// Function to write a log entry to the log file
export function logMessage(level: LogLevel, component: string, message: string) {
    ensureLogFileExists();  // Ensure the log file exists before writing to it
    const timestamp = formatTimestamp();
    const logEntry = `[${timestamp}][${level}][${component}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}



// Function to print log entries that match the specified log level
export function printLogsByLevel(level: LogLevel) {
    ensureLogFileExists();  // Ensure the log file exists before reading it

    // Read the entire log file
    const logFileContent = fs.readFileSync(logFilePath, 'utf-8');
    const logEntries = logFileContent.split('\n');

    // Filter and print log entries that match the specified level
    logEntries.forEach((logEntry) => {
        if (logEntry.includes(`[${level}]`)) {
            console.log(logEntry);
        }
    });
}

// Example log messages
logMessage(LogLevel.INFO, "API Call", "Called GitHub for contributor data");
logMessage(LogLevel.ERROR, "Test Link", "URL was unable to connect");


