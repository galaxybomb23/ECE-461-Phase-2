
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
export function logMessage(component: string, messages: string[]) {

    let log_message: string;
    let type: string;

    if(env_logLevel  === 1){
        log_message = messages[0];  // Set message to Info message
        type = 'INFO';
    } else {
        log_message = messages[1];  // Set message to Debug message
        type = 'DEBUG';
    }

    ensureLogFileExists();  // Ensure the log file exists before writing to it
    const timestamp = formatTimestamp();
    const logEntry = `[${timestamp}][${type}][${component}] ${log_message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}



// Sample Calls

// // Example of logging an INFO message
// logMessage('Database Connection', ['Connection established successfully.', 'Connecting to the database...']);

// // Example of logging a DEBUG message
// logMessage('UserService', ['User details fetched.', 'Fetching user details for user ID: 123']);

// // Example of logging an INFO message for an API call
// logMessage('API', ['Received a request for /api/data.', 'Making an API call to fetch data.']);

// // Example of logging a DEBUG message for an error
// logMessage('ErrorHandler', ['An error occurred while processing the request.', 'Error: Invalid user input.']);
