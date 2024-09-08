import { parse_urls } from "./URL/isolate_urls";
import { test_url } from "./URL/test_url";

// Automatically run the function when the script is executed
const filename = process.argv[2]; // Get the filename from command-line arguments
if (filename) {
    const urls = parse_urls(filename);
    if (urls == 0){
        console.error("File Not Found");
    }
    if (Array.isArray(urls) && urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
            test_url(urls[i]).then(exists => {
                console.log('URL ', urls[i], 'exists:', exists);
            });
        }
        console.log("After for loop");
    }
} else {
    console.error('Please provide a filename as a command-line argument.');
}