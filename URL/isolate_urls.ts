// Takes in a file
import * as fs from 'fs';


// Function pares URL file into array of URLs
export function parse_urls(filename: string): string[] | number{

    // Return 0 (for error) if file does not exist
    if(!fs.existsSync(filename)){
        return 0;
    }

    const file_content = fs.readFileSync(filename, 'utf-8');    // Read file content

    return(file_content.split('\n'));   // Return array of URLs
}