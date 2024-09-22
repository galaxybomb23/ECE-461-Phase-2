import { testURL, URLType, parseURLs, get_valid_urls } from '../src/URL';
import { logMessage } from '../src/logFile';
import * as fs from 'fs';
import { exit } from 'process';

// Mock dependencies
jest.mock('fs');
jest.mock('process', () => ({
    exit: jest.fn(),
    argv: ['node', 'script', 'testFile.txt'],
}));
jest.mock('../src/logFile');

// Mock global fetch function
global.fetch = jest.fn();

describe('URL Utility Functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('testURL', () => {
        it('should return true if the URL is accessible (status 200-299)', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await testURL('https://example.com');

            expect(result).toBe(true);
            expect(logMessage).toHaveBeenCalledWith('testURL', ['Checking URL accessibility.', 'Testing URL: https://example.com']);
            expect(logMessage).toHaveBeenCalledWith('testURL', ['URL accessibility check completed.', 'Response OK: true']);
        });

        it('should return false if the URL is not accessible', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            const result = await testURL('https://example.com');

            expect(result).toBe(false);
            expect(logMessage).toHaveBeenCalledWith('testURL', ['URL accessibility check completed.', 'Response OK: false']);
        });

        it('should return false and log an error if there is an exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

            const result = await testURL('https://example.com');

            expect(result).toBe(false);
            expect(logMessage).toHaveBeenCalledWith('testURL', ['Error while checking URL accessibility.', 'Error: Error: Network Error']);
        });
    });

    describe('URLType', () => {
        it('should return "github" if the URL contains github.com', () => {
            const result = URLType('https://github.com/user/repo');

            expect(result).toBe('github');
            expect(logMessage).toHaveBeenCalledWith('URLType', ['Determining URL type.', 'Evaluating URL: https://github.com/user/repo']);
            expect(logMessage).toHaveBeenCalledWith('URLType', ['Match found for URL type.', 'Matched type: github']);
        });

        it('should return "npmjs" if the URL contains npmjs.com', () => {
            const result = URLType('https://www.npmjs.com/package/example');

            expect(result).toBe('npmjs');
            expect(logMessage).toHaveBeenCalledWith('URLType', ['Determining URL type.', 'Evaluating URL: https://www.npmjs.com/package/example']);
            expect(logMessage).toHaveBeenCalledWith('URLType', ['Match found for URL type.', 'Matched type: npmjs']);
        });

        it('should return "other" if the URL does not contain github.com or npmjs.com', () => {
            const result = URLType('https://example.com');

            expect(result).toBe('other');
            expect(logMessage).toHaveBeenCalledWith('URLType', ['Determining URL type.', 'Evaluating URL: https://example.com']);
            expect(logMessage).toHaveBeenCalledWith('URLType', ['No match found for URL type.', 'Returning "other".']);
        });
    });

    describe('parseURLs', () => {
        // it('should return an array of URLs if the file exists and contains URLs', () => {
        //     (fs.existsSync as jest.Mock).mockReturnValue(true);
        //     (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com\nhttps://github.com');

        //     const result = parseURLs('testFile.txt');

        //     expect(result).toEqual(['https://example.com', 'https://github.com']);
        //     expect(logMessage).toHaveBeenCalledWith('parseURLs', ['File exists, reading content.', 'Filename: testFile.txt']);
        //     expect(logMessage).toHaveBeenCalledWith('parseURLs', ['Parsing URLs from file content.', 'Content length: 40']);
        // });

        it('should return an empty array if the file is empty', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.readFileSync as jest.Mock).mockReturnValue('');

            const result = parseURLs('testFile.txt');

            expect(result).toEqual([]);
            expect(logMessage).toHaveBeenCalledWith('parseURLs', ['File content is empty.', 'Returning empty array.']);
        });

        it('should call exit if the file does not exist', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            parseURLs('testFile.txt');

            expect(logMessage).toHaveBeenCalledWith('parseURLs', ['File does not exist.', 'Filename: testFile.txt']);
            expect(exit).toHaveBeenCalledWith(1);
        });
    });

    describe('get_valid_urls', () => {
        it('should return an array of valid URLs after testing each URL for accessibility', async () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com\nhttps://github.com');
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await get_valid_urls('testFile.txt');

            expect(result).toEqual(['https://example.com', 'https://github.com']);
            expect(logMessage).toHaveBeenCalledWith('get_valid_urls', ['Getting valid URLs from file.', 'Filename: testFile.txt']);
            expect(logMessage).toHaveBeenCalledWith('get_valid_urls', ['Returning valid URLs.', 'Count: 2']);
        });

        // it('should exit if an error occurs during URL testing', async () => {
        //     (fs.existsSync as jest.Mock).mockReturnValue(true);
        //     (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com');
        //     (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

        //     await get_valid_urls('testFile.txt');

        //     expect(logMessage).toHaveBeenCalledWith('get_valid_urls', ['Error processing URL.', 'Error: Error: Network Error']);
        //     expect(exit).toHaveBeenCalledWith(1);
        // });
    });
});