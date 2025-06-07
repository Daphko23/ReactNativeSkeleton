/**
 * @file date-utils.test.ts
 * @description Comprehensive tests for date utility functions
 */

import {
  formatDate,
  formatDateWithTime,
  isDateInPast,
  parseGermanDate
} from '../date-utils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format valid date to German format', () => {
      const result = formatDate('2023-12-25T00:00:00.000Z');
      expect(result).toBe('25.12.2023');
    });

    it('should format ISO date correctly', () => {
      const result = formatDate('2023-01-01T10:30:00.000Z');
      expect(result).toBe('01.01.2023');
    });

    it('should handle date with single digit month and day', () => {
      const result = formatDate('2023-03-05T00:00:00.000Z');
      expect(result).toBe('05.03.2023');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });

    it('should return empty string for empty input', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });

    it('should handle leap year correctly', () => {
      const result = formatDate('2024-02-29T00:00:00.000Z');
      expect(result).toBe('29.02.2024');
    });
  });

  describe('formatDateWithTime', () => {
    it('should format date with time in German format', () => {
      const result = formatDateWithTime('2023-12-25T14:30:00.000Z');
      expect(result).toBe('25.12.2023, 15:30');
    });

    it('should handle midnight correctly', () => {
      const result = formatDateWithTime('2023-01-01T00:00:00.000Z');
      expect(result).toBe('01.01.2023, 01:00');
    });

    it('should handle noon correctly', () => {
      const result = formatDateWithTime('2023-06-15T12:00:00.000Z');
      expect(result).toBe('15.06.2023, 14:00');
    });

    it('should pad single digit time values', () => {
      const result = formatDateWithTime('2023-03-05T09:05:00.000Z');
      expect(result).toBe('05.03.2023, 10:05');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateWithTime('not-a-date');
      expect(result).toBe('');
    });

    it('should return empty string for empty input', () => {
      const result = formatDateWithTime('');
      expect(result).toBe('');
    });
  });

  describe('isDateInPast', () => {
    it('should return true for past date', () => {
      const pastDate = '2020-01-01T00:00:00.000Z';
      const result = isDateInPast(pastDate);
      expect(result).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = '2030-12-31T23:59:59.999Z';
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

    it('should handle current date correctly', () => {
      const now = new Date().toISOString();
      const result = isDateInPast(now);
      // Should be false or true depending on exact timing, but shouldn't throw
      expect(typeof result).toBe('boolean');
    });
  });

  describe('parseGermanDate', () => {
    it('should parse valid German date format', () => {
      const result = parseGermanDate('25.12.2023');
      expect(result).toBe('2023-12-25T00:00:00.000Z');
    });

    it('should parse date with single digits', () => {
      const result = parseGermanDate('5.3.2023');
      expect(result).toBe('2023-03-04T23:00:00.000Z');
    });

    it('should handle leap year date', () => {
      const result = parseGermanDate('29.02.2024');
      expect(result).toBe('2024-02-29T00:00:00.000Z');
    });

    it('should return null for invalid format', () => {
      const result = parseGermanDate('2023-12-25');
      expect(result).toBeNull();
    });

    it('should return null for invalid date values', () => {
      const result = parseGermanDate('32.13.2023');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseGermanDate('');
      expect(result).toBeNull();
    });

    it('should return null for incomplete date', () => {
      const result = parseGermanDate('25.12');
      expect(result).toBeNull();
    });

    it('should return null for non-numeric values', () => {
      const result = parseGermanDate('aa.bb.cccc');
      expect(result).toBeNull();
    });

    it('should return null for malformed input', () => {
      const result = parseGermanDate('25-12-2023');
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle timezone differences correctly', () => {
      // Test with a date that might cross timezone boundaries
      const result = formatDate('2023-12-31T23:00:00.000Z');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    });

    it('should handle very old dates', () => {
      const result = formatDate('1900-01-01T00:00:00.000Z');
      expect(result).toBe('01.01.1900');
    });

    it('should handle far future dates', () => {
      const result = formatDate('2100-12-31T00:00:00.000Z');
      expect(result).toBe('31.12.2100');
    });
  });
});

