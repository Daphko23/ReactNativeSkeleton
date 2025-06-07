/**
 * @fileoverview Insufficient Credits Error
 * @description Fehler für unzureichende Credits
 * 
 * @module InsufficientCreditsError
 */

export class InsufficientCreditsError extends Error {
  public readonly code = 'INSUFFICIENT_CREDITS';
  
  constructor(required: number, available: number) {
    super(`Insufficient credits: required ${required}, available ${available}`);
    this.name = 'InsufficientCreditsError';
  }
} 