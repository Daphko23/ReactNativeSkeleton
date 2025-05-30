/**
 * @file auth-user.mapper.test.ts
 * @description Comprehensive tests for AuthUser Data Mapper
 * Tests provider data transformation, validation, sanitization, and security
 */

import { AuthUserMapper } from '../../../data/mappers/auth-user.mapper';
import { AuthUser } from '../../../domain/entities/auth-user.interface';
import { User } from '@supabase/supabase-js';

describe('AuthUserMapper - ENTERPRISE DATA TRANSFORMATION', () => {
  describe('🔄 fromSupabaseUser() - Provider Data Transformation', () => {
    describe('✅ Successful Transformations', () => {
      it('should transform complete Supabase user to AuthUser', () => {
        const supabaseUser: User = {
          id: 'auth0|507f1f77bcf86cd799439011',
          email: 'John.Doe@Company.COM',
          user_metadata: {
            display_name: 'John Doe',
            avatar_url: 'https://secure.gravatar.com/avatar/123.jpg'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result).toEqual({
          id: 'auth0|507f1f77bcf86cd799439011',
          email: 'john.doe@company.com', // Normalized
          displayName: 'John Doe',
          photoURL: 'https://secure.gravatar.com/avatar/123.jpg',
          emailVerified: false,
          lastLoginAt: undefined
        });
      });

      it('should handle minimal required user data', () => {
        const supabaseUser: User = {
          id: 'minimal-user-123',
          email: 'minimal@test.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result).toEqual({
          id: 'minimal-user-123',
          email: 'minimal@test.com',
          displayName: undefined,
          photoURL: undefined,
          emailVerified: false,
          lastLoginAt: undefined
        });
      });

      it('should normalize email to lowercase', () => {
        const supabaseUser: User = {
          id: 'email-test-user',
          email: 'UPPERCASE.EMAIL@DOMAIN.COM',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.email).toBe('uppercase.email@domain.com');
      });

      it('should trim whitespace from email', () => {
        const supabaseUser: User = {
          id: 'whitespace-test-user',
          email: '  user@domain.com  ',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.email).toBe('user@domain.com');
      });

      it('should handle verified email status', () => {
        const supabaseUser: User = {
          id: 'verified-user',
          email: 'verified@test.com',
          email_confirmed_at: '2024-01-15T10:30:00Z',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.emailVerified).toBe(true);
      });

      it('should parse last_sign_in_at timestamp correctly', () => {
        const testDate = '2024-01-15T10:30:00Z';
        const supabaseUser: User = {
          id: 'last-login-user',
          email: 'lastlogin@test.com',
          last_sign_in_at: testDate,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-14T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.lastLoginAt).toEqual(new Date(testDate));
      });
    });

    describe('🛡️ Security and Sanitization Tests', () => {
      it('should sanitize XSS in display name', () => {
        const supabaseUser: User = {
          id: 'xss-test-user',
          email: 'xss@test.com',
          user_metadata: {
            display_name: '<script>alert("xss")</script>John Doe'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe('alert("xss")John Doe');
        expect(result.displayName).not.toContain('<script>');
      });

      it('should limit display name length to prevent DoS', () => {
        const longName = 'A'.repeat(200);
        const supabaseUser: User = {
          id: 'long-name-user',
          email: 'longname@test.com',
          user_metadata: {
            display_name: longName
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName!.length).toBeLessThanOrEqual(100);
        expect(result.displayName).toBe('A'.repeat(100));
      });

      it('should validate photo URL protocol (HTTPS only)', () => {
        const httpPhotoUrl = 'http://insecure.com/avatar.jpg';
        const supabaseUser: User = {
          id: 'insecure-photo-user',
          email: 'insecure@test.com',
          user_metadata: {
            avatar_url: httpPhotoUrl
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.photoURL).toBeUndefined();
      });

      it('should validate photo URL format', () => {
        const invalidUrl = 'not-a-valid-url';
        const supabaseUser: User = {
          id: 'invalid-url-user',
          email: 'invalidurl@test.com',
          user_metadata: {
            avatar_url: invalidUrl
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.photoURL).toBeUndefined();
      });

      it('should handle malformed user metadata gracefully', () => {
        const supabaseUser: User = {
          id: 'malformed-metadata-user',
          email: 'malformed@test.com',
          user_metadata: {
            display_name: null,
            avatar_url: undefined
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBeUndefined();
        expect(result.photoURL).toBeUndefined();
      });

      it('should handle SQL injection attempts in display name', () => {
        const sqlInjection = "'; DROP TABLE users; --";
        const supabaseUser: User = {
          id: 'sql-injection-user',
          email: 'sql@test.com',
          user_metadata: {
            display_name: sqlInjection
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe("'; DROP TABLE users; --");
        // Should not throw or execute SQL
      });

      it('should handle Unicode characters in display name', () => {
        const unicodeName = 'José María 🌟 林田';
        const supabaseUser: User = {
          id: 'unicode-user',
          email: 'unicode@test.com',
          user_metadata: {
            display_name: unicodeName
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe(unicodeName);
      });
    });

    describe('❌ Error Handling and Validation', () => {
      it('should throw ValidationError for missing user ID', () => {
        const supabaseUser: User = {
          id: '',
          email: 'test@example.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        expect(() => {
          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }).toThrow('ValidationError: User ID is required for domain entity creation');
      });

      it('should throw ValidationError for null user ID', () => {
        const supabaseUser: User = {
          id: null as any,
          email: 'test@example.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        expect(() => {
          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }).toThrow('ValidationError: User ID is required for domain entity creation');
      });

      it('should throw ValidationError for missing email', () => {
        const supabaseUser: User = {
          id: 'valid-id',
          email: null as any,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        expect(() => {
          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }).toThrow('ValidationError: User email is required for domain entity creation');
      });

      it('should throw ValidationError for empty email', () => {
        const supabaseUser: User = {
          id: 'valid-id',
          email: '',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        expect(() => {
          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }).toThrow('ValidationError: User email is required for domain entity creation');
      });

      it('should throw ValidationError for invalid email format', () => {
        const invalidEmails = [
          'invalid-email',
          'missing@domain',
          '@missinglocal.com',
          'spaces in@email.com',
          'double@@domain.com'
        ];

        invalidEmails.forEach(invalidEmail => {
          const supabaseUser: User = {
            id: 'valid-id',
            email: invalidEmail,
            user_metadata: {},
            app_metadata: {},
            aud: 'authenticated',
            created_at: '2024-01-15T10:30:00Z'
          };

          expect(() => {
            AuthUserMapper.fromSupabaseUser(supabaseUser);
          }).toThrow('ValidationError: Invalid email format from authentication provider');
        });
      });

      it('should handle missing created_at gracefully', () => {
        const supabaseUser: User = {
          id: 'missing-date-user',
          email: 'missingdate@test.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: undefined as any
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.id).toBe('missing-date-user');
        expect(result.email).toBe('missingdate@test.com');
      });

      it('should handle invalid date strings gracefully', () => {
        const supabaseUser: User = {
          id: 'invalid-date-user',
          email: 'invaliddate@test.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: 'invalid-date-string'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.id).toBe('invalid-date-user');
        expect(result.email).toBe('invaliddate@test.com');
      });
    });

    describe('🧩 Edge Cases and Boundary Conditions', () => {
      it('should handle empty string display name', () => {
        const supabaseUser: User = {
          id: 'empty-name-user',
          email: 'empty@test.com',
          user_metadata: {
            display_name: ''
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBeUndefined();
      });

      it('should handle whitespace-only display name', () => {
        const supabaseUser: User = {
          id: 'whitespace-name-user',
          email: 'whitespace@test.com',
          user_metadata: {
            display_name: '   \t\n   '
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBeUndefined();
      });

      it('should handle numeric display name', () => {
        const supabaseUser: User = {
          id: 'numeric-name-user',
          email: 'numeric@test.com',
          user_metadata: {
            display_name: 12345 as any
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe('12345');
      });

      it('should handle boolean avatar URL', () => {
        const supabaseUser: User = {
          id: 'boolean-avatar-user',
          email: 'boolean@test.com',
          user_metadata: {
            avatar_url: true as any
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.photoURL).toBeUndefined();
      });

      it('should handle very long valid photo URL', () => {
        const longUrl = 'https://example.com/' + 'a'.repeat(2000) + '.jpg';
        const supabaseUser: User = {
          id: 'long-url-user',
          email: 'longurl@test.com',
          user_metadata: {
            avatar_url: longUrl
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.photoURL).toBe(longUrl);
      });

      it('should handle special characters in email', () => {
        const specialEmail = 'user+tag@sub-domain.example-site.co.uk';
        const supabaseUser: User = {
          id: 'special-email-user',
          email: specialEmail,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.email).toBe(specialEmail);
      });
    });

    describe('📊 Performance and Memory Tests', () => {
      it('should handle large-scale data transformation efficiently', () => {
        const startTime = Date.now();
        
        // Transform 1000 users
        for (let i = 0; i < 1000; i++) {
          const supabaseUser: User = {
            id: `performance-user-${i}`,
            email: `user${i}@performance.test`,
            user_metadata: {
              display_name: `User ${i}`,
              avatar_url: `https://avatar.com/user${i}.jpg`
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: '2024-01-15T10:30:00Z'
          };

          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }

        const endTime = Date.now();
        const executionTime = endTime - startTime;

        expect(executionTime).toBeLessThan(1000); // Should complete under 1 second
      });

      it('should not retain references to source objects', () => {
        const supabaseUser: User = {
          id: 'reference-test-user',
          email: 'reference@test.com',
          user_metadata: {
            display_name: 'Reference Test'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        // Modify source object
        supabaseUser.email = 'modified@test.com';
        supabaseUser.user_metadata!.display_name = 'Modified Name';

        // Result should be unaffected
        expect(result.email).toBe('reference@test.com');
        expect(result.displayName).toBe('Reference Test');
      });

      it('should handle concurrent transformations', async () => {
        const promises = Array(100).fill(null).map((_, index) => {
          return new Promise<AuthUser>((resolve) => {
            const supabaseUser: User = {
              id: `concurrent-user-${index}`,
              email: `concurrent${index}@test.com`,
              user_metadata: {},
              app_metadata: {},
              aud: 'authenticated',
              created_at: '2024-01-15T10:30:00Z'
            };

            const result = AuthUserMapper.fromSupabaseUser(supabaseUser);
            resolve(result);
          });
        });

        const results = await Promise.all(promises);

        expect(results).toHaveLength(100);
        results.forEach((result, index) => {
          expect(result.id).toBe(`concurrent-user-${index}`);
          expect(result.email).toBe(`concurrent${index}@test.com`);
        });
      });
    });

    describe('🔒 Compliance and Audit Tests', () => {
      it('should not log sensitive user information during transformation', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const supabaseUser: User = {
          id: 'audit-test-user',
          email: 'audit@test.com',
          user_metadata: {
            display_name: 'Audit Test User'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        AuthUserMapper.fromSupabaseUser(supabaseUser);

        // Verify no sensitive data was logged
        expect(consoleSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('audit@test.com')
        );
        expect(consoleErrorSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('Audit Test User')
        );

        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });

      it('should maintain data integrity during transformation', () => {
        const supabaseUser: User = {
          id: 'integrity-test-user',
          email: 'integrity@test.com',
          user_metadata: {
            display_name: 'Integrity Test'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result1 = AuthUserMapper.fromSupabaseUser(supabaseUser);
        const result2 = AuthUserMapper.fromSupabaseUser(supabaseUser);

        // Multiple transformations should be identical
        expect(result1).toEqual(result2);
      });

      it('should handle GDPR compliance requirements', () => {
        const supabaseUser: User = {
          id: 'gdpr-test-user',
          email: 'gdpr@test.com',
          user_metadata: {
            display_name: 'GDPR Test User',
            sensitive_data: 'This should not be transformed'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-15T10:30:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        // Only known, safe fields should be included
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('displayName');
        expect(result).toHaveProperty('photoURL');
        expect(result).not.toHaveProperty('sensitive_data');
      });
    });
  });
}); 