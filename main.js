"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isolate_urls_1 = require("./URL/isolate_urls");
var test_url_1 = require("./URL/test_url");
// Automatically run the function when the script is executed
var filename = process.argv[2]; // Get the filename from command-line arguments
if (filename) {
    var urls = (0, isolate_urls_1.parse_urls)(filename);
    if (urls == 0) {
        console.error("File Not Found");
    }
    console.log(urls);
    if (Array.isArray(urls) && urls.length > 0) {
        for (var i = 0; i < urls.length; i++) {
            if ((0, test_url_1.test_url)(urls[i])) {
                console.log('URL ', urls[i], 'exists');
            }
            else {
                console.log('URL ', urls[i], 'does not exists');
            }
        }
        console.log("After for loop");
    }
}
else {
    console.error('Please provide a filename as a command-line argument.');
}
