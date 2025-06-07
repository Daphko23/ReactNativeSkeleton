/**
 * @file sanitize-input.test.ts
 * @description Comprehensive tests for input sanitization functions
 */

import {
  sanitizeInput,
  sanitizeNumericInput,
  sanitizeEmailInput
} from '../sanitize-input';

describe('Sanitize Input Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove leading and trailing whitespace', () => {
      const result = sanitizeInput('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should remove HTML tags', () => {
      const result = sanitizeInput('hello<script>alert("xss")</script>world');
      expect(result).toBe('helloscriptalert("xss")/scriptworld');
    });

    it('should remove angle brackets', () => {
      const result = sanitizeInput('hello<world>test');
      expect(result).toBe('helloworldtest');
    });

    it('should remove control characters', () => {
      const result = sanitizeInput('hello\u0000\u001F\u007Fworld');
      expect(result).toBe('helloworld');
    });

    it('should limit string length to 500 characters', () => {
      const longString = 'a'.repeat(600);
      const result = sanitizeInput(longString);
      expect(result).toHaveLength(500);
      expect(result).toBe('a'.repeat(500));
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = sanitizeInput(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = sanitizeInput(undefined as any);
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      const result = sanitizeInput(123 as any);
      expect(result).toBe('');
    });

    it('should preserve normal text', () => {
      const result = sanitizeInput('Hello World! This is a normal text.');
      expect(result).toBe('Hello World! This is a normal text.');
    });

    it('should handle special characters correctly', () => {
      const result = sanitizeInput('Hello @#$%^&*()_+-=[]{}|;:,./?"');
      expect(result).toBe('Hello @#$%^&*()_+-=[]{}|;:,./?"');
    });

    it('should handle unicode characters', () => {
      const result = sanitizeInput('Hëllö Wörld 你好 🌟');
      expect(result).toBe('Hëllö Wörld 你好 🌟');
    });
  });

  describe('sanitizeNumericInput', () => {
    it('should keep only digits', () => {
      const result = sanitizeNumericInput('abc123def456');
      expect(result).toBe('123456');
    });

    it('should remove all non-numeric characters', () => {
      const result = sanitizeNumericInput('!@#$%^&*()123');
      expect(result).toBe('123');
    });

    it('should handle phone number format', () => {
      const result = sanitizeNumericInput('+1 (555) 123-4567');
      expect(result).toBe('15551234567');
    });

    it('should handle decimal points and negative signs', () => {
      const result = sanitizeNumericInput('-123.45');
      expect(result).toBe('12345');
    });

    it('should return empty string for no digits', () => {
      const result = sanitizeNumericInput('abcdefg');
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizeNumericInput('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = sanitizeNumericInput(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = sanitizeNumericInput(undefined as any);
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      const result = sanitizeNumericInput(123 as any);
      expect(result).toBe('');
    });

    it('should handle only numbers correctly', () => {
      const result = sanitizeNumericInput('1234567890');
      expect(result).toBe('1234567890');
    });

    it('should handle mixed content', () => {
      const result = sanitizeNumericInput('Order #12345 for $67.89');
      expect(result).toBe('123456789');
    });
  });

  describe('sanitizeEmailInput', () => {
    it('should normalize email to lowercase', () => {
      const result = sanitizeEmailInput('TEST@EXAMPLE.COM');
      expect(result).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const result = sanitizeEmailInput('  test@example.com  ');
      expect(result).toBe('test@example.com');
    });

    it('should keep valid email characters', () => {
      const result = sanitizeEmailInput('user.name@example-domain.com');
      expect(result).toBe('user.name@example-domain.com');
    });

    it('should remove invalid characters', () => {
      const result = sanitizeEmailInput('test()[]{}@example.com');
      expect(result).toBe('test@example.com');
    });

    it('should limit length to 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = sanitizeEmailInput(longEmail);
      expect(result).toHaveLength(254);
    });

    it('should handle empty string', () => {
      const result = sanitizeEmailInput('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = sanitizeEmailInput(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = sanitizeEmailInput(undefined as any);
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      const result = sanitizeEmailInput(123 as any);
      expect(result).toBe('');
    });

    it('should preserve dots and hyphens', () => {
      const result = sanitizeEmailInput('user.name@sub-domain.example.com');
      expect(result).toBe('user.name@sub-domain.example.com');
    });

    it('should remove spaces and special characters', () => {
      const result = sanitizeEmailInput('test @exam ple.com!#$');
      expect(result).toBe('test@example.com');
    });

    it('should handle international characters', () => {
      const result = sanitizeEmailInput('tëst@example.com');
      expect(result).toBe('tst@example.com');
    });

    it('should handle complex invalid input', () => {
      const result = sanitizeEmailInput('te<>st[]{}()@exa!@#$mple.com');
      expect(result).toBe('test@exa@mple.com');
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle XSS attempt in sanitizeInput', () => {
      const xssAttempt = '<script>alert("xss")</script>';
      const result = sanitizeInput(xssAttempt);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should handle SQL injection patterns in sanitizeInput', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const result = sanitizeInput(sqlInjection);
      expect(result).toBe("'; DROP TABLE users; --");
    });

    it('should handle very long numeric strings', () => {
      const longNumeric = '1'.repeat(1000);
      const result = sanitizeNumericInput(`abc${longNumeric}def`);
      expect(result).toBe(longNumeric);
    });

    it('should handle email with multiple @ symbols', () => {
      const result = sanitizeEmailInput('user@@domain@example.com');
      expect(result).toBe('user@@domain@example.com');
    });

    it('should handle empty email parts', () => {
      const result = sanitizeEmailInput('@example.com');
      expect(result).toBe('@example.com');
    });
  });
});
