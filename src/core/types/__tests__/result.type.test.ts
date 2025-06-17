/**
 * @file Tests für das Result Pattern - Kernstück der Geschäftslogik
 */

import {Result} from '../result.type';

describe('Result Type Tests', () => {
  // ==========================================
  // ✅ SUCCESS RESULT TESTS
  // ==========================================

  describe('Success Results', () => {
    test('should create success result with string', () => {
      const result = Result.success('test-string');

      expect(result.success).toBe(true);
      expect(result.data).toBe('test-string');
      expect(result.error).toBeUndefined();
      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);
    });

    test('should create success result with object', () => {
      const testObject = {name: 'test', value: 42};
      const result = Result.success(testObject);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testObject);
      expect(result.error).toBeUndefined();
      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);
    });

    test('should create success result with array', () => {
      const testArray = ['item1', 'item2', 'item3'];
      const result = Result.success(testArray);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testArray);
      expect(result.error).toBeUndefined();
    });

    test('should create success result with null', () => {
      const result = Result.success(null);

      expect(result.success).toBe(true);
      expect(result.data).toBe(null);
      expect(result.error).toBeUndefined();
    });

    test('should create success result with undefined', () => {
      const result = Result.success(undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBe(undefined);
      expect(result.error).toBeUndefined();
    });

    test('should create success result with boolean values', () => {
      const trueResult = Result.success(true);
      const falseResult = Result.success(false);

      expect(trueResult.data).toBe(true);
      expect(falseResult.data).toBe(false);
    });

    test('should create success result with numeric values', () => {
      const zeroResult = Result.success(0);
      const positiveResult = Result.success(42);
      const negativeResult = Result.success(-1);

      expect(zeroResult.data).toBe(0);
      expect(positiveResult.data).toBe(42);
      expect(negativeResult.data).toBe(-1);
    });
  });

  // ==========================================
  // ❌ ERROR RESULT TESTS
  // ==========================================

  describe('Error Results', () => {
    test('should create error result with string message', () => {
      const error = 'Something went wrong';
      const result = Result.error<string>(error);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe(error);
      expect(result.isSuccess()).toBe(false);
      expect(result.isError()).toBe(true);
    });

    test('should create error result with typed error', () => {
      const error = 'Invalid input';
      const result = Result.error<number>(error);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe(error);
    });

    test('should create error result with boolean type', () => {
      const error = 'Boolean operation failed';
      const result = Result.error<boolean>(error);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe(error);
    });

    test('should create error result with custom error object', () => {
      const error = {code: 500, message: 'Internal Server Error'};
      const result = Result.error<string, typeof error>(error);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(error);
    });

    test('should handle different error types', () => {
      const typeResult = Result.error<string>('Type Error');
      const rangeResult = Result.error<string>('Range Error');
      const refResult = Result.error<string>('Reference Error');

      expect(typeResult.error).toBe('Type Error');
      expect(rangeResult.error).toBe('Range Error');
      expect(refResult.error).toBe('Reference Error');
    });
  });

  // ==========================================
  // 🔄 UTILITY METHOD TESTS
  // ==========================================

  describe('Utility Methods', () => {
    test('getData() should return data for success result', () => {
      const result = Result.success('test-data');
      expect(result.getData()).toBe('test-data');
    });

    test('getData() should return undefined for error result', () => {
      const result = Result.error('error');
      expect(result.getData()).toBeUndefined();
    });

    test('getError() should return error for error result', () => {
      const result = Result.error('test-error');
      expect(result.getError()).toBe('test-error');
    });

    test('getError() should return undefined for success result', () => {
      const result = Result.success('data');
      expect(result.getError()).toBeUndefined();
    });
  });
});
