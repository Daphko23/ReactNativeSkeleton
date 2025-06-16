/**
 * 🏗️ UNIFIED RESULT TYPE SYSTEM - ARCHITECTURE FIX 2025
 * 
 * ✅ Single Result API - eliminates ResultFactory vs Result confusion
 * ✅ Consistent Properties - .success, .data, .error
 * ✅ Proper Generics - Result<T, E = string>
 * ✅ Type Guards - isSuccess(), isError()
 * ✅ Enterprise Ready - full TypeScript support
 */

/**
 * 🎯 UNIFIED RESULT TYPE - Single Source of Truth
 */
export class Result<T = any, E = string> {
  public readonly success: boolean;
  public readonly data?: T;
  public readonly error?: E;

  private constructor(success: boolean, data?: T, error?: E) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  /**
   * ✅ Creates a successful Result
   */
  static success<T, E = string>(data: T): Result<T, E> {
    return new Result<T, E>(true, data);
  }

  /**
   * ✅ Creates a failed Result
   */
  static error<T = any, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * 🔍 Type guard - checks if result is successful
   */
  isSuccess(): this is Result<T, never> {
    return this.success;
  }

  /**
   * 🔍 Type guard - checks if result is failed
   */
  isError(): this is Result<never, E> {
    return !this.success;
  }

  /**
   * 🎯 Get data with type safety
   */
  getData(): T | undefined {
    return this.data;
  }

  /**
   * 🎯 Get error with type safety
   */
  getError(): E | undefined {
    return this.error;
  }
}

/**
 * 🏗️ LEGACY COMPATIBILITY LAYER
 * 
 * @deprecated Use Result.success() and Result.error() instead
 * This will be removed in future versions
 */
export class ResultFactory {
  /**
   * @deprecated Use Result.success() instead
   */
  static success<T>(value: T): Result<T> {
    return Result.success(value);
  }

  /**
   * @deprecated Use Result.error() instead
   */
  static failure<T>(error: Error | string): Result<T, string> {
    const errorMessage = error instanceof Error ? error.message : error;
    return Result.error<T>(errorMessage);
  }
}

/**
 * 🎯 TYPE ALIASES for common patterns
 */
export type AsyncResult<T, E = string> = Promise<Result<T, E>>;
export type VoidResult<E = string> = Result<void, E>;
export type AsyncVoidResult<E = string> = Promise<Result<void, E>>;

/**
 * 🛠️ UTILITY FUNCTIONS
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is Result<T, never> => {
  return result.isSuccess();
};

export const isError = <T, E>(result: Result<T, E>): result is Result<never, E> => {
  return result.isError();
};

/**
 * 🎯 RESULT COMBINATORS
 */
export const combineResults = <T1, T2, E = string>(
  result1: Result<T1, E>,
  result2: Result<T2, E>
): Result<[T1, T2], E> => {
  if (result1.isError()) return result1 as Result<[T1, T2], E>;
  if (result2.isError()) return result2 as Result<[T1, T2], E>;
  return Result.success<[T1, T2], E>([result1.data!, result2.data!]);
};

export const mapResult = <T, U, E = string>(
  result: Result<T, E>,
  mapper: (data: T) => U
): Result<U, E> => {
  if (result.isError()) return result as Result<U, E>;
  return Result.success<U, E>(mapper(result.data!));
};

export const flatMapResult = <T, U, E = string>(
  result: Result<T, E>,
  mapper: (data: T) => Result<U, E>
): Result<U, E> => {
  if (result.isError()) return result as any;
  return mapper(result.data!);
};
