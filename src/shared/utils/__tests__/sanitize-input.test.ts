/**
 * @file Tests for input sanitization utility functions
 */

import {
  sanitizeInput,
  sanitizeNumericInput,
  sanitizeEmailInput,
} from '../sanitize-input';

describe('Input Sanitization Utils', () => {
  describe('sanitizeInput', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = sanitizeInput('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should remove HTML characters', () => {
      const result = sanitizeInput('hello<script>alert("xss")</script>world');
      expect(result).toBe('helloscriptalert("xss")/scriptworld');
    });

    it('should remove angle brackets specifically', () => {
      const result = sanitizeInput('text<>more text');
      expect(result).toBe('textmore text');
    });

    it('should remove control characters', () => {
      const input = 'hello\u0000\u0001\u001F\u007Fworld';
      const result = sanitizeInput(input);
      expect(result).toBe('helloworld');
    });

    it('should limit length to 500 characters', () => {
      const longInput = 'a'.repeat(600);
      const result = sanitizeInput(longInput);
      expect(result).toHaveLength(500);
      expect(result).toBe('a'.repeat(500));
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle string with only whitespace', () => {
      const result = sanitizeInput('   \t\n   ');
      expect(result).toBe('');
    });

    it('should preserve valid text content', () => {
      const validText =
        'This is valid text with numbers 123 and symbols !@#$%^&*()';
      const result = sanitizeInput(validText);
      expect(result).toBe(validText);
    });

    it('should handle mixed dangerous content', () => {
      const dangerousInput = '  <script>evil</script>\u0000normal text\u001F  ';
      const result = sanitizeInput(dangerousInput);
      expect(result).toBe('scriptevil/scriptnormal text');
    });

    describe('edge cases', () => {
      it('should return empty string for null input', () => {
        const result = sanitizeInput(null as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for undefined input', () => {
        const result = sanitizeInput(undefined as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for non-string input', () => {
        const result = sanitizeInput(123 as unknown as string);
        expect(result).toBe('');
      });

      it('should handle string with only dangerous characters', () => {
        const result = sanitizeInput('<>\u0000\u001F');
        expect(result).toBe('');
      });
    });
  });

  describe('sanitizeNumericInput', () => {
    it('should keep only digits', () => {
      const result = sanitizeNumericInput('abc123def456');
      expect(result).toBe('123456');
    });

    it('should remove all non-numeric characters', () => {
      const result = sanitizeNumericInput('1a2b3c!@#$%4567');
      expect(result).toBe('1234567');
    });

    it('should handle phone number format', () => {
      const result = sanitizeNumericInput('+49 (0) 123-456-7890');
      expect(result).toBe('4901234567890');
    });

    it('should handle empty string', () => {
      const result = sanitizeNumericInput('');
      expect(result).toBe('');
    });

    it('should handle string with no digits', () => {
      const result = sanitizeNumericInput('abcdef!@#$%');
      expect(result).toBe('');
    });

    it('should preserve leading zeros', () => {
      const result = sanitizeNumericInput('00123');
      expect(result).toBe('00123');
    });

    it('should handle special characters and symbols', () => {
      const result = sanitizeNumericInput('1.23€ + 4,56$ = 5.79£');
      expect(result).toBe('123456579');
    });

    describe('edge cases', () => {
      it('should return empty string for null input', () => {
        const result = sanitizeNumericInput(null as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for undefined input', () => {
        const result = sanitizeNumericInput(undefined as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for non-string input', () => {
        const result = sanitizeNumericInput(123 as unknown as string);
        expect(result).toBe('');
      });

      it('should handle very long numeric string', () => {
        const longNumeric = '1'.repeat(1000);
        const result = sanitizeNumericInput(longNumeric);
        expect(result).toBe(longNumeric);
      });
    });
  });

  describe('sanitizeEmailInput', () => {
    it('should convert to lowercase', () => {
      const result = sanitizeEmailInput('TEST@EXAMPLE.COM');
      expect(result).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const result = sanitizeEmailInput('  test@example.com  ');
      expect(result).toBe('test@example.com');
    });

    it('should remove invalid email characters', () => {
      const result = sanitizeEmailInput('test!#$%&*()@example.com');
      expect(result).toBe('test@example.com');
    });

    it('should keep valid email characters', () => {
      const result = sanitizeEmailInput('test.email-123@example-site.co.uk');
      expect(result).toBe('test.email-123@example-site.co.uk');
    });

    it('should limit length to 254 characters (RFC compliant)', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = sanitizeEmailInput(longEmail);
      expect(result).toHaveLength(254);
    });

    it('should handle plus addressing', () => {
      const result = sanitizeEmailInput('test+tag@example.com');
      expect(result).toBe('testtag@example.com');
    });

    it('should handle subdomain emails', () => {
      const result = sanitizeEmailInput('user@mail.sub.example.com');
      expect(result).toBe('user@mail.sub.example.com');
    });

    it('should handle empty string', () => {
      const result = sanitizeEmailInput('');
      expect(result).toBe('');
    });

    it('should remove spaces in email', () => {
      const result = sanitizeEmailInput('test @exam ple.com');
      expect(result).toBe('test@example.com');
    });

    it('should handle mixed case with special characters', () => {
      const result = sanitizeEmailInput('TeSt!@#$%^&*()@ExAmPlE.CoM');
      expect(result).toBe('test@@example.com');
    });

    describe('edge cases', () => {
      it('should return empty string for null input', () => {
        const result = sanitizeEmailInput(null as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for undefined input', () => {
        const result = sanitizeEmailInput(undefined as unknown as string);
        expect(result).toBe('');
      });

      it('should return empty string for non-string input', () => {
        const result = sanitizeEmailInput(123 as unknown as string);
        expect(result).toBe('');
      });

      it('should handle email with only invalid characters', () => {
        const result = sanitizeEmailInput('!@#$%^&*()');
        expect(result).toBe('@');
      });

      it('should handle Unicode characters correctly', () => {
        const result = sanitizeEmailInput('tëst@éxämplé.com');
        expect(result).toBe('tst@xmpl.com'); // Should remove non-ASCII
      });
    });
  });

  describe('security testing', () => {
    it('should prevent XSS in sanitizeInput', () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        '<svg onload=alert("xss")>',
        '"><script>alert("xss")</script>',
      ];

      xssAttempts.forEach(xss => {
        const result = sanitizeInput(xss);
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
      });
    });

    it('should handle SQL injection patterns in sanitizeInput', () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        'UNION SELECT * FROM passwords',
      ];

      sqlInjectionAttempts.forEach(sql => {
        const result = sanitizeInput(sql);
        expect(result.length).toBeLessThanOrEqual(500);
        expect(result).not.toContain('\u0000'); // No null bytes
      });
    });

    it('should handle path traversal patterns', () => {
      const pathTraversalAttempts = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '....//....//....//etc/passwd',
      ];

      pathTraversalAttempts.forEach(path => {
        const result = sanitizeInput(path);
        expect(result.length).toBeLessThanOrEqual(500);
      });
    });
  });
});
