/**
 * @file Tests für das Result Pattern - Kernstück der Geschäftslogik
 */

import {Result, ResultFactory} from '../result.type';

describe('Result Type', () => {
  describe('Result Interface', () => {
    it('sollte ein Success Result korrekt repräsentieren', () => {
      const result: Result<string> = {
        isSuccess: true,
        value: 'test-value',
      };

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe('test-value');
      expect(result.error).toBeUndefined();
    });

    it('sollte ein Failure Result korrekt repräsentieren', () => {
      const result: Result<string> = {
        isSuccess: false,
        error: 'Test error message',
      };

      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe('Test error message');
      expect(result.value).toBeUndefined();
    });

    it('sollte mit null/undefined Werten umgehen', () => {
      const nullResult: Result<null> = {
        isSuccess: true,
        value: null,
      };

      const undefinedResult: Result<undefined> = {
        isSuccess: true,
        value: undefined,
      };

      expect(nullResult.isSuccess).toBe(true);
      expect(nullResult.value).toBeNull();
      expect(undefinedResult.isSuccess).toBe(true);
      expect(undefinedResult.value).toBeUndefined();
    });
  });

  describe('ResultFactory', () => {
    describe('success()', () => {
      it('sollte ein Success Result mit String-Wert erstellen', () => {
        const result = ResultFactory.success('test-string');

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe('test-string');
        expect(result.error).toBeUndefined();
      });

      it('sollte ein Success Result mit Object-Wert erstellen', () => {
        const testObject = {id: '123', name: 'Test'};
        const result = ResultFactory.success(testObject);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(testObject);
        expect(result.error).toBeUndefined();
      });

      it('sollte ein Success Result mit Array-Wert erstellen', () => {
        const testArray = [1, 2, 3];
        const result = ResultFactory.success(testArray);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(testArray);
        expect(result.error).toBeUndefined();
      });

      it('sollte ein Success Result mit null-Wert erstellen', () => {
        const result = ResultFactory.success(null);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeNull();
        expect(result.error).toBeUndefined();
      });

      it('sollte ein Success Result mit undefined-Wert erstellen', () => {
        const result = ResultFactory.success(undefined);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeUndefined();
        expect(result.error).toBeUndefined();
      });

      it('sollte ein Success Result mit boolean-Wert erstellen', () => {
        const trueResult = ResultFactory.success(true);
        const falseResult = ResultFactory.success(false);

        expect(trueResult.isSuccess).toBe(true);
        expect(trueResult.value).toBe(true);
        expect(falseResult.isSuccess).toBe(true);
        expect(falseResult.value).toBe(false);
      });

      it('sollte ein Success Result mit number-Wert erstellen', () => {
        const zeroResult = ResultFactory.success(0);
        const positiveResult = ResultFactory.success(42);
        const negativeResult = ResultFactory.success(-1);

        expect(zeroResult.isSuccess).toBe(true);
        expect(zeroResult.value).toBe(0);
        expect(positiveResult.value).toBe(42);
        expect(negativeResult.value).toBe(-1);
      });
    });

    describe('failure()', () => {
      it('sollte ein Failure Result mit Error-Objekt erstellen', () => {
        const error = new Error('Test error message');
        const result = ResultFactory.failure<string>(error);

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe('Test error message');
        expect(result.value).toBeUndefined();
      });

      it('sollte ein Failure Result mit Custom Error erstellen', () => {
        class CustomError extends Error {
          constructor(message: string) {
            super(message);
            this.name = 'CustomError';
          }
        }

        const error = new CustomError('Custom error occurred');
        const result = ResultFactory.failure<number>(error);

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe('Custom error occurred');
        expect(result.value).toBeUndefined();
      });

      it('sollte ein Failure Result mit leerem Error-Message erstellen', () => {
        const error = new Error('');
        const result = ResultFactory.failure<boolean>(error);

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe('');
        expect(result.value).toBeUndefined();
      });

      it('sollte ein Failure Result mit undefined Error-Message erstellen', () => {
        // Simulate an error with undefined message
        const error = new Error();
        (error as {message: string | undefined}).message = undefined;
        const result = ResultFactory.failure<string>(error);

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBeUndefined();
        expect(result.value).toBeUndefined();
      });

      it('sollte verschiedene Error-Typen verarbeiten', () => {
        const typeError = new TypeError('Type error');
        const rangeError = new RangeError('Range error');
        const referenceError = new ReferenceError('Reference error');

        const typeResult = ResultFactory.failure<string>(typeError);
        const rangeResult = ResultFactory.failure<string>(rangeError);
        const refResult = ResultFactory.failure<string>(referenceError);

        expect(typeResult.error).toBe('Type error');
        expect(rangeResult.error).toBe('Range error');
        expect(refResult.error).toBe('Reference error');
      });
    });

    describe('Type Safety', () => {
      it('sollte TypeScript-kompatible Typisierung haben', () => {
        // String Result
        const stringResult: Result<string> = ResultFactory.success('test');
        expect(typeof stringResult.value).toBe('string');

        // Number Result
        const numberResult: Result<number> = ResultFactory.success(42);
        expect(typeof numberResult.value).toBe('number');

        // Object Result
        interface TestInterface {
          id: string;
          name: string;
        }
        const objectResult: Result<TestInterface> = ResultFactory.success({
          id: '123',
          name: 'Test',
        });
        expect(objectResult.value?.id).toBe('123');

        // Array Result
        const arrayResult: Result<string[]> = ResultFactory.success(['a', 'b']);
        expect(Array.isArray(arrayResult.value)).toBe(true);
      });

      it('sollte Generic Types korrekt verarbeiten', () => {
        // Generic function that returns Result
        function processData<T>(data: T): Result<T> {
          if (data === null || data === undefined) {
            return ResultFactory.failure(
              new Error('Data is null or undefined')
            );
          }
          return ResultFactory.success(data);
        }

        const stringResult = processData('test');
        const numberResult = processData(123);
        const nullResult = processData(null);

        expect(stringResult.isSuccess).toBe(true);
        expect(numberResult.isSuccess).toBe(true);
        expect(nullResult.isSuccess).toBe(false);
      });
    });

    describe('Business Logic Integration', () => {
      it('sollte in einer Service-Methode verwendbar sein', () => {
        // Simuliert Service-Pattern mit Result
        class TestService {
          validateInput(input: string): Result<string> {
            if (!input || input.trim().length === 0) {
              return ResultFactory.failure(
                new Error('Input darf nicht leer sein')
              );
            }
            if (input.length > 100) {
              return ResultFactory.failure(new Error('Input zu lang'));
            }
            return ResultFactory.success(input.trim());
          }
        }

        const service = new TestService();

        // Valid input
        const validResult = service.validateInput('  valid input  ');
        expect(validResult.isSuccess).toBe(true);
        expect(validResult.value).toBe('valid input');

        // Empty input
        const emptyResult = service.validateInput('');
        expect(emptyResult.isSuccess).toBe(false);
        expect(emptyResult.error).toBe('Input darf nicht leer sein');

        // Too long input
        const longInput = 'a'.repeat(101);
        const longResult = service.validateInput(longInput);
        expect(longResult.isSuccess).toBe(false);
        expect(longResult.error).toBe('Input zu lang');
      });

      it('sollte Chaining von Results ermöglichen', () => {
        // Chain multiple operations
        function processStep1(input: string): Result<string> {
          if (!input) return ResultFactory.failure(new Error('Step 1 failed'));
          return ResultFactory.success(input.toUpperCase());
        }

        function processStep2(input: string): Result<string> {
          if (input.length < 3)
            return ResultFactory.failure(new Error('Step 2 failed'));
          return ResultFactory.success(input + '_PROCESSED');
        }

        function processChain(input: string): Result<string> {
          const step1 = processStep1(input);
          if (!step1.isSuccess) return step1;

          return processStep2(step1.value!);
        }

        // Success case
        const successResult = processChain('hello');
        expect(successResult.isSuccess).toBe(true);
        expect(successResult.value).toBe('HELLO_PROCESSED');

        // Failure in step 1
        const failStep1 = processChain('');
        expect(failStep1.isSuccess).toBe(false);
        expect(failStep1.error).toBe('Step 1 failed');

        // Failure in step 2
        const failStep2 = processChain('hi');
        expect(failStep2.isSuccess).toBe(false);
        expect(failStep2.error).toBe('Step 2 failed');
      });
    });

    describe('Edge Cases', () => {
      it('sollte mit sehr großen Strings umgehen', () => {
        const largeString = 'a'.repeat(10000);
        const result = ResultFactory.success(largeString);

        expect(result.isSuccess).toBe(true);
        expect(result.value?.length).toBe(10000);
      });

      it('sollte mit komplexen Objektstrukturen umgehen', () => {
        const complexObject = {
          level1: {
            level2: {
              level3: {
                data: [1, 2, 3],
                metadata: {
                  created: new Date(),
                  tags: ['tag1', 'tag2'],
                },
              },
            },
          },
        };

        const result = ResultFactory.success(complexObject);
        expect(result.isSuccess).toBe(true);
        expect(result.value?.level1.level2.level3.data).toEqual([1, 2, 3]);
      });

      it('sollte mit Error-Objekten ohne Message umgehen', () => {
        const errorWithoutMessage = new Error();
        const result = ResultFactory.failure<string>(errorWithoutMessage);

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe('');
      });
    });
  });
});
