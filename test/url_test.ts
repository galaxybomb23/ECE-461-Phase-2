import { parse_urls } from "./../src/URL/isolate_urls";
import { test_url, async_test_url } from "./../src/URL/test_url";


const filename = process.argv[2]; // Get the filename from command-line arguments
if (filename) {
    const urls = parse_urls(filename);
    if (urls == 0){
        console.error("File Not Found");
    }
    console.log(urls);
    if (Array.isArray(urls) && urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
            if(test_url(urls[i])){
                console.log('URL ', urls[i], 'exists');
            } else {
                console.log('URL ', urls[i], 'does not exists');
            }
        }
        console.log("After for loop");
    }
} else {
    console.error('Please provide a filename as a command-line argument.');
}