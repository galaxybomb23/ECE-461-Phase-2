import * as fs from 'fs';
import * as path from 'path';
import { logMessage, getUserTimezone, ensureLogFileExists, formatTimestamp } from '../src/logFile';

// Mock dependencies
jest.mock('fs');
jest.mock('path');

describe('LogFile Utility Functions', () => {
  const mockDate = new Date('2022-09-20T12:00:00.000Z'); // Mock date object

  beforeEach(() => {
    jest.restoreAllMocks(); // Clear mocks between tests
  
    // Mock global Date implementation
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
  
    // Mock Intl.DateTimeFormat including supportedLocalesOf
    Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
      format: jest.fn().mockReturnValue('09/20/2022'),
      supportedLocalesOf: jest.fn().mockReturnValue(['en-US']), // Add this to mock supportedLocalesOf
      resolvedOptions: jest.fn().mockReturnValue({
        timeZone: 'America/New_York' // Mock the resolved time zone as well
      })
    })) as unknown as typeof Intl.DateTimeFormat;
  });

  describe('getUserTimezone', () => {
    it('should return the user\'s timezone', () => {
      const result = getUserTimezone();
      expect(result).toBe('America/New_York');
    });
  });

  describe('ensureLogFileExists', () => {
    it('should create a log file if it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      ensureLogFileExists();

      expect(fs.existsSync).toHaveBeenCalledWith(expect.any(String));
      expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), '', 'utf-8');
    });

    it('should not create a log file if it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      ensureLogFileExists();

      expect(fs.existsSync).toHaveBeenCalledWith(expect.any(String));
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('formatTimestamp', () => {
    it('should return a correctly formatted timestamp with timezone', () => {
      const mockTimezone = 'PST';
      Intl.DateTimeFormat = jest.fn().mockImplementation((locale, options) => ({
        formatToParts: jest.fn().mockReturnValue([
          { type: 'year', value: '2023' },
          { type: 'month', value: '09' },
          { type: 'day', value: '15' },
          { type: 'hour', value: '14' },
          { type: 'minute', value: '30' },
          { type: 'second', value: '45' },
          { type: 'timeZoneName', value: mockTimezone }
        ]),
        supportedLocalesOf: jest.fn().mockReturnValue(['en-US']), // Mock supportedLocalesOf
        resolvedOptions: jest.fn().mockReturnValue({ timeZone: 'America/Los_Angeles' })
      } as any));

      const result = formatTimestamp();
      expect(result).toBe('2023-09-15 14:30:45 PST');
    });
  });

  describe('logMessage', () => {
    const mockLogFilePath = '/path/to/log/file.log';
    const mockComponent = 'TestComponent';
    const mockMessages = ['Info message', 'Debug message'];

    beforeAll(() => {
      process.env.LOG_FILE = mockLogFilePath;
      process.env.LOG_LEVEL = '2'; // DEBUG level

      (path.join as jest.Mock).mockReturnValue(mockLogFilePath);
    });

    it('should log the DEBUG message when log level is 2', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.appendFileSync as jest.Mock).mockImplementation(() => {});

      logMessage(mockComponent, mockMessages);

      const expectedLogEntry = expect.stringContaining('DEBUG');
      expect(fs.appendFileSync).toHaveBeenCalledWith(mockLogFilePath, expectedLogEntry, 'utf-8');
    });

    it('should log the INFO message when log level is 1', () => {
      process.env.LOG_LEVEL = '1'; // INFO level

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.appendFileSync as jest.Mock).mockImplementation(() => {});

      logMessage(mockComponent, mockMessages);

      const expectedLogEntry = expect.stringContaining('INFO');
      expect(fs.appendFileSync).toHaveBeenCalledWith(mockLogFilePath, expectedLogEntry, 'utf-8');
    });

    it('should ensure the log file exists before logging', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      logMessage(mockComponent, mockMessages);

      expect(fs.existsSync).toHaveBeenCalledWith(mockLogFilePath);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});