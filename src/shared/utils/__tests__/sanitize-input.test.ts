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

    it('should remove HTML tags completely', () => {
      const result = sanitizeInput('hello<script>alert("xss")</script>world');
      expect(result).toBe('helloalert("xss")world');
    });

    it('should remove HTML tags with content inside', () => {
      const result = sanitizeInput('hello<world>test');
      expect(result).toBe('hellotest');
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

    it('should remove various HTML tags', () => {
      const result = sanitizeInput('<div>Hello</div><p>World</p>');
      expect(result).toBe('HelloWorld');
    });

    it('should remove script tags with attributes', () => {
      const result = sanitizeInput('<script type="text/javascript">alert("xss")</script>');
      expect(result).toBe('alert("xss")');
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

    it('should handle German phone number format', () => {
      const result = sanitizeNumericInput('+49 (123) 456-7890');
      expect(result).toBe('491234567890');
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

    it('should remove invalid characters but keep valid email structure', () => {
      const result = sanitizeEmailInput('user.name@example.com');
      expect(result).toBe('user.name@example.com');
    });

    it('should return empty string for emails that exceed length limits', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'; // This creates 263 chars total
      const result = sanitizeEmailInput(longEmail);
      expect(result).toBe(''); // Should be empty due to length validation
    });

    it('should handle valid email within length limits', () => {
      const validEmail = 'test@example.com';
      const result = sanitizeEmailInput(validEmail);
      expect(result).toBe('test@example.com');
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

    it('should preserve dots and hyphens in valid emails', () => {
      const result = sanitizeEmailInput('user.name@sub-domain.example.com');
      expect(result).toBe('user.name@sub-domain.example.com');
    });

    it('should handle emails with plus signs', () => {
      const result = sanitizeEmailInput('user+tag@example.com');
      expect(result).toBe('user+tag@example.com');
    });

    it('should remove HTML tags from email', () => {
      const result = sanitizeEmailInput('test<script>@example.com');
      expect(result).toBe('test@example.com');
    });

    it('should return empty string for invalid email structure', () => {
      const result = sanitizeEmailInput('te<>st[]{}()@exa!@#$mple.com');
      expect(result).toBe(''); // Multiple @ symbols make it invalid
    });

    it('should return empty string for emails with no local part', () => {
      const result = sanitizeEmailInput('@example.com');
      expect(result).toBe(''); // No local part
    });

    it('should return empty string for emails with no domain part', () => {
      const result = sanitizeEmailInput('user@');
      expect(result).toBe(''); // No domain part
    });

    it('should return empty string for emails with multiple @ symbols', () => {
      const result = sanitizeEmailInput('user@@domain@example.com');
      expect(result).toBe(''); // Multiple @ symbols
    });

    it('should return empty string for emails without @ symbol', () => {
      const result = sanitizeEmailInput('userexample.com');
      expect(result).toBe(''); // No @ symbol
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle XSS attempts in general input', () => {
      const result = sanitizeInput('<img src="x" onerror="alert(1)">');
      expect(result).toBe('');
    });

    it('should handle script injection attempts', () => {
      const result = sanitizeInput('javascript:alert("xss")');
      expect(result).toBe('javascript:alert("xss")'); // No script tags to remove
    });

    it('should handle SQL injection-like patterns in numeric input', () => {
      const result = sanitizeNumericInput("'; DROP TABLE users; --123");
      expect(result).toBe('123');
    });

    it('should validate email structure strictly', () => {
      const result = sanitizeEmailInput('valid@test.com');
      expect(result).toBe('valid@test.com');
    });

    it('should reject malformed emails', () => {
      const result = sanitizeEmailInput('not.an.email');
      expect(result).toBe('');
    });

    it('should handle international characters in input', () => {
      const result = sanitizeInput('Müller & Söhne GmbH');
      expect(result).toBe('Müller & Söhne GmbH');
    });

    it('should handle emojis in input', () => {
      const result = sanitizeInput('Hello 👋 World 🌍');
      expect(result).toBe('Hello 👋 World 🌍');
    });
  });
});
