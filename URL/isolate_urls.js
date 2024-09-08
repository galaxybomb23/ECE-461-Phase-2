"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_urls = parse_urls;
// Takes in a file
var fs = require("fs");
// Function pares URL file into array of URLs
function parse_urls(filename) {
    // Return 0 (for error) if file does not exist
    if (!fs.existsSync(filename)) {
        return 0;
    }
    var file_content = fs.readFileSync(filename, 'utf-8'); // Read file content
    return (file_content.split('\n')); // Return array of URLs
}
