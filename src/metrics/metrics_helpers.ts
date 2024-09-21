import * as fs from 'fs';
import {fetchGithubRepoData} from '../getRepoInfo';
import { calculateCorrectness } from './correctness';
import { getLicense } from './license';
import { calculateRampUp } from './rampUp';
import { calculateResponsiveMaintainer } from './responsiveMaintainer';
import { getNodeJsAPILink } from '../nodejs_data';
import { url_type } from '../url';


async function getJSON(url: string): Promise<any> {
    const URL_type = url_type(url); // Determine if the URL is GitHub or npmjs

    let packageData: any;
    

    try {
        if (URL_type === 'github') {
            packageData = await fetchGithubRepoData(url); // Fetch data from GitHub
            return packageData;
        } else if (URL_type === 'npmjs') {
            try {
            const temp_link = await getNodeJsAPILink(url);
            packageData = await fetchGithubRepoData(temp_link);}
            catch{
                console.log('link error');
            }
             // exit on 1 error
            return packageData;
         
        } else {
            throw new Error('Invalid URL type. Only GitHub or npmjs URLs are supported.');
        }

        
        
        return packageData;
    } catch (error) {
        console.error('Error fetching package data:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
}



















/**
 * Main function to calculate and output all metrics for a given npm package URL.
 * @param {string} npmPackageUrl - The URL of the npm package.
 */
async function main(npmPackageUrl: string) {
    try {
        const start = Date.now();
        
        const  packageData  = await getJSON(npmPackageUrl); // Fetch data and fetch latency
        const metadataFilePath = './META.json';
        fs.writeFileSync(metadataFilePath, JSON.stringify(packageData, null, 2), 'utf-8');
   
        const pack_type = url_type(npmPackageUrl);
         


        const fetchLatencyp =Date.now() - start;
        const fetchLatency = (fetchLatencyp / 1000).toFixed(3); // Convert to seconds and round to 3 decimal places; 
        
        // Calculate metrics with total latency (including fetch latency)
        const rampUp = calculateRampUpMain(packageData, fetchLatency, pack_type);
        const license = getLicense(packageData);
        const licenselat =  Date.now() - start;
        
        
      

        const corec_time = Date.now();
        //const { openIssuesCount, closedIssuesCount } = await getIssuesCount(npmPackageUrl, packageData);
        const openIssuesCount = packageData.open_issues_count || 0; // Extract open issues from the JSON
        const closedIssuesCount = packageData.closed_issues_count || 0;

        
       
        const latency_correct = Date.now() - corec_time;

        const correctness = calculateCorrectness(openIssuesCount, fetchLatency);

        const responsiveMaintainer = calculateResponsiveMaintainer(openIssuesCount,closedIssuesCount, fetchLatency);
        


        // Output the results with total latency in seconds
        console.log(`Metrics for package: ${npmPackageUrl}`);
        console.log(`RampUp Score: ${rampUp.score.toFixed(2)} (Total Latency: ${rampUp.latency} seconds)`);
        console.log(`Correctness Score: ${correctness.score.toFixed(2)} (Total Latency: ${correctness.latency + latency_correct} seconds)`);
        console.log(`License Score: ${license} (Total Latency: ${licenselat} seconds)`); // Use await before accessing properties
        console.log(`Responsive Maintainer Score: ${responsiveMaintainer.score} (Total Latency: ${responsiveMaintainer.latency} seconds)`);
    } catch (error) {
        console.error('Error processing package:', error);
    }
}

// Example usage: replace with any npm package URL
// const npmPackageUrl = 'https://www.npmjs.com/package/express';
//const npmPackageUrl = 'https://www.npmjs.com/package/browserify';
//const npmPackageUrl = 'https://github.com/nullivex/nodist';
const npmPackageUrl ='https://github.com/browserify/browserify';

main(npmPackageUrl).catch(console.error);

