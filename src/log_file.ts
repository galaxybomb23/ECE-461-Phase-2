// import * as fs from 'fs';
// import * as path from 'path';

// // Access the environment variable for the log file path
// const logFilePath = process.env.LOG_FILE || './default.log'; // Default to './default.log' if not set

// // Ensure the log directory exists
// const logDir = path.dirname(logFilePath);
// if (!fs.existsSync(logDir)) {
//     fs.mkdirSync(logDir, { recursive: true });
// }

// // Function to log messages
// function logMessage(message: string) {
//     // Create the log entry with a timestamp
//     const logEntry = `[${new Date().toISOString()}] ${message}\n`;

//     // Check if the log file exists
//     if (!fs.existsSync(logFilePath)) {
//         // Create an empty log file if it does not exist
//         fs.writeFileSync(logFilePath, '', 'utf8');
//     }

//     // Append the log message to the log file
//     fs.appendFileSync(logFilePath, logEntry, 'utf8');
// }

// // Example usage
// logMessage('Application started');
// logMessage('This is an informational log entry');

// import * as fs from 'fs';
// import * as path from 'path';

// // Get environment variables
// const logFile = process.env.LOG_FILE || './default.log';
// const logLevel = Number(process.env.LOG_LEVEL) || 0;  // Default to 0 if LOG_LEVEL is not set

// // Function to get current timestamp
// function getTimestamp(): string {
//     return new Date().toISOString();  // Returns timestamp in ISO format
// }

// // Function to log a message with timestamp and log level
// function logMessage(level: 'info' | 'debug', description: string) {
//     const message = `[${getTimestamp()}] ${level} - ${description}`;
    
//     if (!fs.existsSync(logFile)) {
//         // If the log file doesn't exist, create it
//         fs.writeFileSync(logFile, '', { flag: 'w' });
//     }
    
//     // Append message to the log file
//     fs.appendFileSync(logFile, message + '\n');
// }

// // Log based on LOG_LEVEL
// if (logLevel >= 1) {
//     logMessage('info', 'This is an informational message.');
// }

// if (logLevel >= 2) {
//     logMessage('debug', 'This is a debug message with more details.');
// }

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
function logMessage(level: LogLevel, component: string, message: string) {
    ensureLogFileExists();  // Ensure the log file exists before writing to it
    const timestamp = formatTimestamp();
    const logEntry = `[${timestamp}][${level}][${component}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}

// Example log messages
logMessage(LogLevel.INFO, "API Call", "Called GitHub for contributor data");
logMessage(LogLevel.ERROR, "Test Link", "URL was unable to connect");


