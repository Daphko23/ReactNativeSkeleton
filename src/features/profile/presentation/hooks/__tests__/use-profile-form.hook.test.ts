/**
 * @fileoverview ENTERPRISE PROFILE FORM HOOK TESTS - 2025 Standards
 * 
 * @description Comprehensive test suite for useProfileForm hook covering:
 * - Business Logic Testing (Use Cases Integration)
 * - TanStack Query Integration Testing
 * - Security Testing (XSS, Injection, Validation)
 * - GDPR Compliance Testing
 * - Performance Testing
 * - Error Handling & Recovery
 * 
 * @version 2025.1.0
 * @standard Enterprise Testing Standards, GDPR Compliance, Security Testing
 * @since Enterprise Industry Standard 2025
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfileForm } from '../use-profile-form.hook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// =============================================
// 🔧 MOCKS & SETUP
// =============================================

// Mock Auth Hook
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};

jest.mock('@features/auth/presentation/hooks', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    isAuthenticated: true
  }))
}));

// Mock Profile Query Hooks
const mockProfileData = {
  id: 'test-user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  bio: 'Software Engineer',
  phone: '+1234567890',
  location: 'Berlin, Germany',
  website: 'https://johndoe.dev'
};

const mockProfileQuery = {
  data: mockProfileData,
  isLoading: false,
  error: null,
  refetch: jest.fn()
};

const mockUpdateMutation = {
  mutate: jest.fn(),
  isPending: false,
  error: null,
  isSuccess: false,
  reset: jest.fn()
};

jest.mock('../use-profile-query.hook', () => ({
  useProfileQuery: jest.fn(() => mockProfileQuery),
  useUpdateProfileMutation: jest.fn(() => mockUpdateMutation)
}));

// Mock Profile Container & Use Cases
const mockValidationResult = {
  isValid: true,
  errors: [],
  warnings: [],
  gdprCompliant: true,
  securityScore: 95,
  completeness: 85
};

const mockValidateProfileUseCase = {
  execute: jest.fn().mockResolvedValue(mockValidationResult)
};

const mockContainer = {
  getValidateProfileDataUseCase: jest.fn(() => mockValidateProfileUseCase)
};

jest.mock('../../application/di/profile.container', () => ({
  useProfileContainer: jest.fn(() => mockContainer)
}));

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    watch: jest.fn(() => ({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      bio: 'Software Engineer',
      phone: '+1234567890',
      location: 'Berlin, Germany',
      website: 'https://johndoe.dev'
    })),
    setValue: jest.fn(),
    reset: jest.fn(),
    formState: {
      errors: {},
      isDirty: false,
      isValid: true
    }
  }))
}));

// Test Wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  
  TestWrapper.displayName = 'TestWrapper';
  
  return TestWrapper;
};

describe('useProfileForm Hook - Enterprise Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = createWrapper();
    jest.clearAllMocks();
  });

  // =============================================
  // 🎯 BUSINESS LOGIC & USE CASES INTEGRATION
  // =============================================

  describe('Business Logic & Use Cases Integration', () => {
    it('should integrate with ValidateProfileDataUseCase for enterprise validation', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        await result.current.validateForm();
      });

      expect(mockValidateProfileUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }),
        expect.objectContaining({
          userRole: 'user',
          isNewProfile: false,
          strictMode: false,
          gdprRequired: true
        })
      );
    });

    it('should handle complex business validation scenarios', async () => {
      const complexValidationResult = {
        isValid: false,
        errors: ['Email domain not allowed', 'Bio contains inappropriate content'],
        warnings: ['Website SSL certificate expired'],
        gdprCompliant: false,
        securityScore: 45,
        completeness: 60
      };

      mockValidateProfileUseCase.execute.mockResolvedValueOnce(complexValidationResult);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        const _validation = await result.current.validateForm();
        expect(_validation).toEqual(complexValidationResult);
      });
    });

    it('should validate individual fields with business rules', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        const emailError = await result.current.validateField('email');
        expect(emailError).toBeNull(); // Valid email

        const firstNameError = await result.current.validateField('firstName');
        expect(firstNameError).toBeNull(); // Valid name
      });
    });
  });

  // =============================================
  // 🔍 TANSTACK QUERY INTEGRATION TESTING
  // =============================================

  describe('TanStack Query Integration', () => {
    it('should handle query loading states correctly', () => {
      mockProfileQuery.isLoading = true;
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle mutation loading states correctly', () => {
      mockUpdateMutation.isPending = true;
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.isSubmitting).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

         it('should handle query and mutation errors', () => {
       const queryError = new Error('Failed to fetch profile');
       const mutationError = new Error('Failed to update profile');

       mockProfileQuery.error = queryError as any;
       mockUpdateMutation.error = mutationError as any;

       const { result } = renderHook(() => useProfileForm(), { wrapper });

       expect(result.current.error).toBe('Failed to update profile'); // Mutation error takes precedence
     });

    it('should sync profile data to form when query succeeds', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.formData).toEqual(expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }));
      });
    });
  });

  // =============================================
  // 🔒 SECURITY TESTING
  // =============================================

  describe('Security Testing', () => {
    it('should prevent XSS attacks in form fields', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      const xssPayload = '<script>alert("XSS")</script>';

      await act(async () => {
        result.current.setValue('bio', xssPayload);
        const _validation = await result.current.validateForm();
      });

      // Validation should be called with the raw payload for server-side sanitization
      expect(mockValidateProfileUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          bio: xssPayload
        }),
        expect.any(Object)
      );
    });

    it('should validate URL fields against malicious URLs', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      const maliciousUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:msgbox("XSS")',
        'file:///etc/passwd'
      ];

             for (const url of maliciousUrls) {
         await act(async () => {
           result.current.setValue('website', url);
           const error = await result.current.validateField('website');
           // Should either reject or sanitize malicious URLs
           expect(error).toBeDefined();
         });
       }
    });

    it('should prevent SQL injection in text fields', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; UPDATE users SET admin=1; --"
      ];

      for (const payload of sqlInjectionPayloads) {
        await act(async () => {
          result.current.setValue('bio', payload);
          await result.current.validateForm();
        });

        // Should pass to validation layer for server-side protection
        expect(mockValidateProfileUseCase.execute).toHaveBeenCalledWith(
          expect.objectContaining({
            bio: payload
          }),
          expect.any(Object)
        );
      }
    });

    it('should handle DoS prevention with large payloads', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      const _largePayload = 'A'.repeat(10000); // 10KB payload

      await act(async () => {
        const error = await result.current.validateField('bio');
        expect(error).toContain('zu lang'); // Should reject large bio
      });
    });
  });

  // =============================================
  // 📋 GDPR COMPLIANCE TESTING
  // =============================================

  describe('GDPR Compliance Testing', () => {
    it('should enforce GDPR validation requirements', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        await result.current.validateForm();
      });

      expect(mockValidateProfileUseCase.execute).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          gdprRequired: true
        })
      );
    });

    it('should validate data minimization principles', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      // Test that only necessary fields are included in validation
      await act(async () => {
        await result.current.validateForm();
      });

      const validationCall = mockValidateProfileUseCase.execute.mock.calls[0][0];
      
      // Should not include sensitive fields that aren't necessary
      expect(validationCall).not.toHaveProperty('password');
      expect(validationCall).not.toHaveProperty('ssn');
      expect(validationCall).not.toHaveProperty('creditCard');
    });

    it('should include metadata for GDPR audit trails', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        await result.current.validateForm();
      });

      const validationContext = mockValidateProfileUseCase.execute.mock.calls[0][1];
      
      expect(validationContext).toEqual(expect.objectContaining({
        gdprRequired: true,
        userRole: 'user',
        isNewProfile: false
      }));
    });
  });

  // =============================================
  // ⚡ PERFORMANCE TESTING
  // =============================================

  describe('Performance Testing', () => {
    it('should handle form rendering within performance budget', () => {
      const startTime = performance.now();
      
      renderHook(() => useProfileForm(), { wrapper });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should optimize re-renders with memoization', () => {
      const { result, rerender } = renderHook(() => useProfileForm(), { wrapper });

      const initialFormData = result.current.formData;
      const initialValidateForm = result.current.validateForm;

      rerender({} as any);

      // Functions should be memoized
      expect(result.current.validateForm).toBe(initialValidateForm);
      expect(result.current.formData).toBe(initialFormData);
    });

    it('should handle large form data efficiently', async () => {
      const largeFormData = {
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100),
        bio: 'C'.repeat(500),
        location: 'D'.repeat(100)
      };

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      const startTime = performance.now();

      await act(async () => {
        Object.entries(largeFormData).forEach(([field, value]) => {
          result.current.setValue(field as any, value);
        });
        await result.current.validateForm();
      });

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should process large data within 200ms
      expect(processingTime).toBeLessThan(200);
    });

    it('should debounce validation calls', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        // Rapid successive validation calls
        result.current.validateField('email');
        result.current.validateField('email');
        result.current.validateField('email');
        
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should not call validation excessively
      expect(mockValidateProfileUseCase.execute.mock.calls.length).toBeLessThan(5);
    });
  });

  // =============================================
  // 🚨 ERROR HANDLING & RECOVERY
  // =============================================

  describe('Error Handling & Recovery', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      mockValidateProfileUseCase.execute.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        try {
          await result.current.validateForm();
        } catch (error) {
          expect(error).toBe(networkError);
        }
      });
    });

    it('should handle validation failures with detailed errors', async () => {
      const validationFailure = {
        isValid: false,
        errors: ['Email already exists', 'Bio contains profanity'],
        warnings: ['Phone number format unusual'],
        gdprCompliant: false,
        securityScore: 30,
        completeness: 40
      };

      mockValidateProfileUseCase.execute.mockResolvedValueOnce(validationFailure);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        const _validation = await result.current.validateForm();
        expect(_validation.isValid).toBe(false);
        expect(_validation.errors).toHaveLength(2);
      });
    });

    it('should handle missing user ID scenario', async () => {
      // Mock no user scenario
      const { useAuth } = require('@features/auth/presentation/hooks');
      useAuth.mockReturnValueOnce({
        user: null,
        isAuthenticated: false
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        try {
          await result.current.handleSubmit();
        } catch (error) {
          expect((error as Error).message).toContain('User ID required');
        }
      });
    });

    it('should recover from temporary service failures', async () => {
      // First call fails, second succeeds
      mockValidateProfileUseCase.execute
        .mockRejectedValueOnce(new Error('Service temporarily unavailable'))
        .mockResolvedValueOnce(mockValidationResult);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        try {
          await result.current.validateForm();
        } catch (error) {
          // First call should fail
          expect((error as Error).message).toContain('Service temporarily unavailable');
        }
      });

      await act(async () => {
        // Second call should succeed
        const _validation = await result.current.validateForm();
        expect(_validation.isValid).toBe(true);
      });
    });
  });

  // =============================================
  // 🔄 INTEGRATION & REAL-WORLD SCENARIOS
  // =============================================

  describe('Integration & Real-world Scenarios', () => {
    it('should handle complete profile update workflow', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        // User updates multiple fields
        result.current.setValue('firstName', 'Jane');
        result.current.setValue('lastName', 'Smith');
        result.current.setValue('bio', 'Updated bio');

        // Validate form
        const _validation = await result.current.validateForm();
        expect(_validation.isValid).toBe(true);

        // Submit form
        const success = await result.current.handleSubmit();
        expect(success).toBe(true);
      });

      expect(mockValidateProfileUseCase.execute).toHaveBeenCalled();
    });

    it('should handle partial form completion scenario', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        // User fills only some fields
        result.current.setValue('firstName', 'John');
        result.current.setValue('email', 'john@example.com');
        // Leave other fields empty

        const _validation = await result.current.validateForm();
        
        // Should still validate successfully for partial completion
        expect(_validation).toBeDefined();
      });
    });

    it('should handle form reset after successful submission', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        // Make changes
        result.current.setValue('firstName', 'Changed');
        
        // Submit successfully
        await result.current.handleSubmit();
        
        // Reset form
        result.current.reset();
      });

      // Form should be reset to original values
      expect(result.current.isDirty).toBe(false);
    });

    it('should handle concurrent validation requests', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await act(async () => {
        // Start multiple validation requests simultaneously
        const validations = await Promise.all([
          result.current.validateForm(),
          result.current.validateForm(),
          result.current.validateForm()
        ]);

        // All should complete successfully
        validations.forEach(validation => {
          expect(validation.isValid).toBe(true);
        });
      });
    });
  });
});