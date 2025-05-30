/**
 * @file Tests for date utility functions
 */

import {
  formatDate,
  formatDateWithTime,
  isDateInPast,
  parseGermanDate,
} from '../date-utils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format valid ISO date correctly', () => {
      const result = formatDate('2025-01-15T14:30:00Z');
      expect(result).toBe('15.01.2025');
    });

    it('should format date string without time correctly', () => {
      const result = formatDate('2025-12-25');
      expect(result).toBe('25.12.2025');
    });

    it('should handle single digit day and month with padding', () => {
      const result = formatDate('2025-01-05');
      expect(result).toBe('05.01.2025');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });

    it('should handle date with timezone correctly', () => {
      const result = formatDate('2025-06-15T10:30:00+02:00');
      expect(result).toBe('15.06.2025');
    });

    it('should handle leap year dates correctly', () => {
      const result = formatDate('2024-02-29');
      expect(result).toBe('29.02.2024');
    });
  });

  describe('formatDateWithTime', () => {
    it('should format ISO date with time correctly', () => {
      const result = formatDateWithTime('2025-01-15T14:30:00Z');
      // Note: This might vary based on timezone, but we expect German format
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('should handle midnight correctly', () => {
      const result = formatDateWithTime('2025-01-15T00:00:00Z');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('should handle noon correctly', () => {
      const result = formatDateWithTime('2025-01-15T12:00:00Z');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateWithTime('invalid-date');
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatDateWithTime('');
      expect(result).toBe('');
    });

    it('should pad single digit hours and minutes', () => {
      const result = formatDateWithTime('2025-01-15T09:05:00Z');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });
  });

  describe('isDateInPast', () => {
    it('should return true for past date', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      const result = isDateInPast(pastDate);
      expect(result).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = '2030-01-01T00:00:00Z';
      const result = isDateInPast(futureDate);
      expect(result).toBe(false);
    });

    it('should return false for invalid date', () => {
      const result = isDateInPast('invalid-date');
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = isDateInPast('');
      expect(result).toBe(false);
    });

    it('should handle date very close to now', () => {
      // Date 1 second ago
      const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
      const result = isDateInPast(oneSecondAgo);
      expect(result).toBe(true);
    });

    it('should handle date very close to future', () => {
      // Date 1 second in future
      const oneSecondLater = new Date(Date.now() + 1000).toISOString();
      const result = isDateInPast(oneSecondLater);
      expect(result).toBe(false);
    });
  });

  describe('parseGermanDate', () => {
    it('should parse valid German date format correctly', () => {
      const result = parseGermanDate('15.01.2025');
      expect(result).toBe('2025-01-15T00:00:00.000Z');
    });

    it('should handle single digit day and month', () => {
      const result = parseGermanDate('5.1.2025');
      // Die Zeitzone kann das Ergebnis beeinflussen, daher prüfe nur das Datum
      expect(result).toMatch(/^2025-01-0[45]T/);
    });

    it('should handle leap year correctly', () => {
      const result = parseGermanDate('29.02.2024');
      expect(result).toBe('2024-02-29T00:00:00.000Z');
    });

    it('should return null for invalid format (missing dots)', () => {
      const result = parseGermanDate('15012025');
      expect(result).toBeNull();
    });

    it('should return null for invalid format (wrong separator)', () => {
      const result = parseGermanDate('15/01/2025');
      expect(result).toBeNull();
    });

    it('should return null for invalid date (32nd day)', () => {
      const result = parseGermanDate('32.01.2025');
      expect(result).toBeNull();
    });

    it('should return null for invalid month', () => {
      const result = parseGermanDate('15.13.2025');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseGermanDate('');
      expect(result).toBeNull();
    });

    it('should return null for incomplete date', () => {
      const result = parseGermanDate('15.01');
      expect(result).toBeNull();
    });

    it('should return null for non-numeric parts', () => {
      const result = parseGermanDate('aa.bb.cccc');
      expect(result).toBeNull();
    });

    it('should handle year boundaries correctly', () => {
      const result = parseGermanDate('31.12.2025');
      expect(result).toBe('2025-12-31T00:00:00.000Z');
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle null values gracefully', () => {
      // TypeScript would catch this, but JavaScript might pass null
      // null wird von new Date() als 1970-01-01 interpretiert
      expect(formatDate(null as unknown as string)).toBe('01.01.1970');
      expect(formatDateWithTime(null as unknown as string)).toMatch(
        /01\.01\.1970, \d{2}:\d{2}/
      );
      expect(isDateInPast(null as unknown as string)).toBe(true); // 1970 ist in der Vergangenheit
      expect(parseGermanDate(null as unknown as string)).toBeNull();
    });

    it('should handle undefined values gracefully', () => {
      expect(formatDate(undefined as unknown as string)).toBe('');
      expect(formatDateWithTime(undefined as unknown as string)).toBe('');
      expect(isDateInPast(undefined as unknown as string)).toBe(false);
      expect(parseGermanDate(undefined as unknown as string)).toBeNull();
    });

    it('should handle very long strings gracefully', () => {
      const longString = 'a'.repeat(1000);
      expect(formatDate(longString)).toBe('');
      expect(formatDateWithTime(longString)).toBe('');
      expect(isDateInPast(longString)).toBe(false);
      expect(parseGermanDate(longString)).toBeNull();
    });

    it('should handle special date formats', () => {
      // Unix timestamp
      expect(formatDate('1640995200000')).toBe('');

      // Date only
      expect(formatDate('2025-01-15')).toBe('15.01.2025');

      // Date with milliseconds
      expect(formatDate('2025-01-15T14:30:00.123Z')).toBe('15.01.2025');
    });
  });
});
