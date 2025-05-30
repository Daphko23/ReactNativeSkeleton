/**
 * @fileoverview PASSWORD-STRENGTH-INDICATOR-INDEX: Component Exports
 * @description Centralized exports for PasswordStrengthIndicator component
 * 
 * @businessRule BR-990: Clean component exports for better modularity
 * @businessRule BR-991: Consistent export patterns across auth components
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordStrengthIndicatorIndex
 * @namespace Auth.Presentation.Components.PasswordStrengthIndicator
 */

// Component exports
export { PasswordStrengthIndicator } from './password-strength-indicator.component';

// Style exports
export { 
  passwordStrengthIndicatorStyles,
  strengthColors,
  requirementColors 
} from './password-strength-indicator.component.style';

// Type exports
export type {
  PasswordValidationResult
} from '../../../domain/interfaces/password-policy.service.interface'; 