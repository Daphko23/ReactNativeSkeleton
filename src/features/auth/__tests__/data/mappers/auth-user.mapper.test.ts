/**
 * @file auth-user.mapper.test.ts
 * @description Comprehensive tests for AuthUserMapper
 * Tests Supabase User to Domain entity mapping with enterprise-level validation
 */

import { AuthUserMapper } from '../../../data/mappers/auth-user.mapper';
import { AuthUser } from '../../../domain/entities/auth-user.interface';
import { User } from '@supabase/supabase-js';

describe('AuthUserMapper - ENTERPRISE MAPPING TESTS', () => {
  describe('🔄 Supabase User to Domain Entity Mapping', () => {
    describe('fromSupabaseUser - Success Cases', () => {
      it('should map complete Supabase user to domain entity successfully', () => {
        const supabaseUser: User = {
          id: 'user-123',
          email: 'Test@Example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z',
          user_metadata: {
            display_name: 'Test User',
            avatar_url: 'https://example.com/photo.jpg'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          last_sign_in_at: '2024-01-01T12:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.id).toBe('user-123');
        expect(result.email).toBe('test@example.com'); // Normalized to lowercase
        expect(result.emailVerified).toBe(true);
        expect(result.displayName).toBe('Test User');
        expect(result.photoURL).toBe('https://example.com/photo.jpg');
        expect(result.lastLoginAt).toEqual(new Date('2024-01-01T12:00:00Z'));
      });

      it('should handle minimal required user data', () => {
        const supabaseUser: User = {
          id: 'minimal-user-123',
          email: 'minimal@test.com',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.id).toBe('minimal-user-123');
        expect(result.email).toBe('minimal@test.com');
        expect(result.emailVerified).toBe(false);
        expect(result.displayName).toBeUndefined();
        expect(result.photoURL).toBeUndefined();
        expect(result.lastLoginAt).toBeUndefined();
      });

      it('should normalize email to lowercase', () => {
        const supabaseUser: User = {
          id: 'email-test-user',
          email: 'UPPERCASE.EMAIL@DOMAIN.COM',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.email).toBe('user@domain.com');
      });

      it('should handle verified email status correctly', () => {
        const supabaseUser: User = {
          id: 'verified-user',
          email: 'verified@test.com',
          email_confirmed_at: '2024-01-01T00:00:00Z',
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.emailVerified).toBe(true);
      });

      it('should handle unverified email status correctly', () => {
        const supabaseUser: User = {
          id: 'unverified-user',
          email: 'unverified@test.com',
          email_confirmed_at: undefined,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.emailVerified).toBe(false);
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

      it('should handle special characters in display name', () => {
        const supabaseUser: User = {
          id: 'special-chars-user',
          email: 'special@test.com',
          user_metadata: {
            display_name: 'Müller, François & José-María'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe('Müller, François & José-María');
      });

      it('should handle various photo URL formats', () => {
        const testCases = [
          'https://example.com/photo.jpg',
          'https://cdn.example.com/users/123/avatar.png',
          'https://gravatar.com/avatar/hash?s=200'
        ];

        testCases.forEach((photoURL, index) => {
          const supabaseUser: User = {
            id: `user-${index}`,
            email: `test${index}@example.com`,
            user_metadata: {
              avatar_url: photoURL
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: '2024-01-01T00:00:00Z'
          };

          const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

          expect(result.photoURL).toBe(photoURL);
        });
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName!.length).toBeLessThanOrEqual(100);
        expect(result.displayName).toBe('A'.repeat(100));
      });

      it('should reject non-HTTPS photo URLs for security', () => {
        const httpPhotoUrl = 'http://insecure.com/avatar.jpg';
        const supabaseUser: User = {
          id: 'insecure-photo-user',
          email: 'insecure@test.com',
          user_metadata: {
            avatar_url: httpPhotoUrl
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.photoURL).toBeUndefined();
      });

      it('should reject invalid photo URL formats', () => {
        const invalidUrl = 'not-a-valid-url';
        const supabaseUser: User = {
          id: 'invalid-url-user',
          email: 'invalidurl@test.com',
          user_metadata: {
            avatar_url: invalidUrl
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBeUndefined();
        expect(result.photoURL).toBeUndefined();
      });

      it('should handle SQL injection attempts in display name safely', () => {
        const sqlInjection = "'; DROP TABLE users; --";
        const supabaseUser: User = {
          id: 'sql-injection-user',
          email: 'sql@test.com',
          user_metadata: {
            display_name: sqlInjection
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.displayName).toBe("'; DROP TABLE users; --");
        // Should not throw or execute SQL - just store as safe string
      });

      it('should preserve Unicode characters in display name', () => {
        const unicodeName = 'José María 🌟 林田';
        const supabaseUser: User = {
          id: 'unicode-user',
          email: 'unicode@test.com',
          user_metadata: {
            display_name: unicodeName
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
            created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
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
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.email).toBe(specialEmail);
      });
    });

    describe('⚡ Performance & Bulk Operations', () => {
      it('should handle large-scale data transformation efficiently', () => {
        const startTime = performance.now();
        
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
            created_at: '2024-01-01T00:00:00Z'
          };

          AuthUserMapper.fromSupabaseUser(supabaseUser);
        }

        const endTime = performance.now();
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
          created_at: '2024-01-01T00:00:00Z'
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
              created_at: '2024-01-01T00:00:00Z'
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

      it('should maintain object identity for repeated mappings', () => {
        const supabaseUser: User = {
          id: 'identity-test-user',
          email: 'identity@test.com',
          user_metadata: {
            display_name: 'Identity Test'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result1 = AuthUserMapper.fromSupabaseUser(supabaseUser);
        const result2 = AuthUserMapper.fromSupabaseUser(supabaseUser);

        // Should create new instances (not cached)
        expect(result1).not.toBe(result2);
        // But with identical values
        expect(result1.id).toBe(result2.id);
        expect(result1.email).toBe(result2.email);
        expect(result1.displayName).toBe(result2.displayName);
      });
    });

    describe('🏢 Enterprise Compliance', () => {
      it('should preserve GDPR-relevant fields correctly', () => {
        const supabaseUser: User = {
          id: 'gdpr-test-user',
          email: 'gdpr@test.com',
          email_confirmed_at: '2024-01-01T00:00:00Z',
          user_metadata: {
            display_name: 'GDPR Test User',
            avatar_url: 'https://secure.example.com/photo.jpg'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-06-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        // All GDPR fields should be preserved
        expect(result.id).toBe('gdpr-test-user');
        expect(result.email).toBe('gdpr@test.com');
        expect(result.emailVerified).toBe(true);
        expect(result.displayName).toBe('GDPR Test User');
        expect(result.photoURL).toBe('https://secure.example.com/photo.jpg');
      });

      it('should handle international characters in all fields', () => {
        const supabaseUser: User = {
          id: 'user-国际化',
          email: 'тест@пример.рф',
          user_metadata: {
            display_name: 'नमस्ते मुकेश 测试用户',
            avatar_url: 'https://例え.テスト/写真.jpg'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z'
        };

        const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

        expect(result.id).toBe('user-国际化');
        expect(result.email).toBe('тест@пример.рф');
        expect(result.displayName).toBe('नमस्ते मुकेश 测试用户');
        expect(result.photoURL).toBe('https://例え.テスト/写真.jpg');
      });

      it('should handle enterprise email domains', () => {
        const enterpriseDomains = [
          'user@enterprise.corp',
          'admin@big-company.internal',
          'service@system.local',
          'api@microservice.k8s.cluster'
        ];

        enterpriseDomains.forEach((email, index) => {
          const supabaseUser: User = {
            id: `enterprise-user-${index}`,
            email,
            user_metadata: {
              display_name: `Enterprise User ${index}`
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: '2024-01-01T00:00:00Z'
          };

          const result = AuthUserMapper.fromSupabaseUser(supabaseUser);

          expect(result.email).toBe(email);
          expect(result.displayName).toBe(`Enterprise User ${index}`);
        });
      });
    });
  });
}); 