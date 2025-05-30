/**
 * @fileoverview AUTH-COMPONENTS-INDEX: Auth Components Central Export
 * @description Central export point for all auth presentation components
 * 
 * @businessRule BR-970: Centralized component exports for better organization
 * @businessRule BR-971: Consistent import patterns across the application
 * @businessRule BR-972: Type-safe component and style exports
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthComponentsIndex
 * @namespace Auth.Presentation.Components
 */

// ==========================================
// 🔐 BIOMETRIC AUTHENTICATION COMPONENTS
// ==========================================

export { 
  BiometricSettings,
  biometricSettingsStyles
} from './biometric-settings';

export type { 
  BiometricSettingsProps 
} from './biometric-settings';

// ==========================================
// 🔑 MULTI-FACTOR AUTHENTICATION COMPONENTS
// ==========================================

export { 
  MFASetupModal,
  mfaSetupModalStyles
} from './mfa-setup-modal';

export type { 
  MFASetupModalProps 
} from './mfa-setup-modal';

// ==========================================
// 🔒 PASSWORD & SECURITY COMPONENTS
// ==========================================

export { 
  PasswordStrengthIndicator,
  passwordStrengthIndicatorStyles,
  strengthColors,
  requirementColors
} from './password-strength-indicator';

export type { 
  PasswordValidationResult 
} from './password-strength-indicator';

// ==========================================
// 📱 COMPONENT STYLE COLLECTIONS
// ==========================================

// Import styles for collection
import { biometricSettingsStyles } from './biometric-settings';
import { mfaSetupModalStyles } from './mfa-setup-modal';
import { passwordStrengthIndicatorStyles } from './password-strength-indicator';

/**
 * @const authComponentStyles
 * @description Collection of all auth component styles for bulk import
 * 
 * @example Bulk Style Import
 * ```typescript
 * import { authComponentStyles } from '@features/auth/presentation/components';
 * 
 * // Use individual styles
 * <View style={authComponentStyles.biometric.container}>
 * <View style={authComponentStyles.mfa.container}>
 * <View style={authComponentStyles.passwordStrength.container}>
 * ```
 */
export const authComponentStyles = {
  biometric: biometricSettingsStyles,
  mfa: mfaSetupModalStyles,
  passwordStrength: passwordStrengthIndicatorStyles,
} as const;
