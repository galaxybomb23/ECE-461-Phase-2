import { url_type, test_url, parse_urls } from "../src/URL";
import * as fs from 'fs';
import { exit } from 'process';
// Mocking fs.existsSync and fs.readFileSync
jest.mock('fs');
jest.mock('process', () => ({
  exit: jest.fn(),
}));
// Mocking a complete Response object and casting it to match the Response type
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    url: '',
    type: 'default',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    json: jest.fn(),
    text: jest.fn(),
  } as unknown as Response) // Casting here
);
describe('test_url', () => {
  it('should return true for a successful URL request', async () => {
    const url = 'https://github.com';
    const result = await test_url(url);
    expect(result).toBe(true);
  });
  it('should return false for a failed URL request', async () => {
    // Mock fetch to return a failed response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false,
        url: '',
        type: 'default',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        json: jest.fn(),
        text: jest.fn(),
      } as unknown as Response)
    );
    const url = 'https://invalid-url.com';
    const result = await test_url(url);
    expect(result).toBe(false);
  });
  it('should return false if fetch throws an error', async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('Network error'));
    const url = 'https://error-url.com';
    const result = await test_url(url);
    expect(result).toBe(false);
  });
});
describe('url_type', () => {
  it('should return "github" for a GitHub URL', () => {
    const url = 'https://github.com/user/repo';
    const result = url_type(url);
    expect(result).toBe('github');
  });
  it('should return "npmjs" for an npmjs URL', () => {
    const url = 'https://www.npmjs.com/package/express';
    const result = url_type(url);
    expect(result).toBe('npmjs');
  });
  it('should return "other" for a non-GitHub/npmjs URL', () => {
    const url = 'https://www.example.com';
    const result = url_type(url);
    expect(result).toBe('other');
  });
});
describe('parse_urls', () => {
  it('should exit with code 1 if the file does not exist', () => {
    // Mock fs.existsSync to return false
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    // Call the function with a non-existent file
    parse_urls('non_existent_file.txt');
    // Expect process.exit to have been called with code 1
    expect(exit).toHaveBeenCalledWith(1);
  });
  it('should return an empty array if the file is empty', () => {
    // Mock fs.existsSync to return true and fs.readFileSync to return an empty string
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('');
    // Call the function with an empty file
    const result = parse_urls('empty_file.txt');
    // Expect an empty array to be returned
    expect(result).toEqual([]);
  });
  it('should return an array of URLs when the file contains URLs', () => {
    // Mock fs.existsSync to return true and fs.readFileSync to return URL content
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('https://github.com\nhttps://www.npmjs.com');
    // Call the function with a file containing URLs
    const result = parse_urls('urls_file.txt');
    // Expect an array of URLs to be returned
    expect(result).toEqual(['https://github.com', 'https://www.npmjs.com']);
  });
});