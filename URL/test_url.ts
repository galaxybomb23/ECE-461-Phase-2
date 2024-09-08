import request from 'sync-request';

// Tests if URL is able to be connected to
export function test_url(url: string): boolean {
    try {   // Try to connect to site, return true if possible
        const response = request('HEAD', url);  // Retrieve head data from site
        return response.statusCode >= 200 && response.statusCode < 400;
    } catch (error) {   // If unable to connect to site, return false
        return false;
    }
}