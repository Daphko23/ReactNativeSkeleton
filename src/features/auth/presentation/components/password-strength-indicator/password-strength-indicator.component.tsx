/**
 * @fileoverview COMPONENT-003: Password Strength Indicator Component
 * @description Real-time password validation with visual feedback and localized content
 * 
 * @businessRule BR-980: Centralized translation system for all text content
 * @businessRule BR-981: Real-time visual feedback for password strength
 * @businessRule BR-982: Theme-integrated styling for consistent design
 * @businessRule BR-983: Accessibility support for password validation
 * 
 * @performance Optimized rendering with useMemo for validation logic
 * @performance Minimal re-renders with selective state updates
 * 
 * @accessibility Screen reader support for password requirements
 * @accessibility High contrast colors for strength visualization
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordStrengthIndicator
 * @namespace Auth.Presentation.Components
 */

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { PasswordValidationResult } from '../../../domain/interfaces/password-policy.service.interface';
import { useAuthTranslations } from '@core/i18n/hooks/useAuthTranslations';
import { 
  passwordStrengthIndicatorStyles as styles, 
  strengthColors, 
  requirementColors 
} from './password-strength-indicator.component.style';

/**
 * @interface PasswordStrengthIndicatorProps
 * @description Props for the PasswordStrengthIndicator component
 */
interface PasswordStrengthIndicatorProps {
  /** Password string to analyze */
  password: string;
  /** Validation result from password policy service */
  validation?: PasswordValidationResult;
  /** Whether to show detailed requirements list */
  showRequirements?: boolean;
}

/**
 * @interface RequirementItemProps
 * @description Props for individual requirement items
 */
interface RequirementItemProps {
  /** Text to display for requirement */
  text: string;
  /** Whether the requirement is currently met */
  met: boolean;
}

/**
 * @component PasswordStrengthIndicator
 * @description Real-time password validation with visual feedback
 * 
 * Provides comprehensive password strength analysis with:
 * - Visual strength bar with color coding
 * - Localized strength text and requirements
 * - Real-time requirement checking
 * - Error message display
 * - Theme-integrated styling
 * - Accessibility support
 * 
 * @param {PasswordStrengthIndicatorProps} props - Component props
 * @returns {JSX.Element | null} Password strength indicator or null if no password
 * 
 * @example Basic Usage
 * ```typescript
 * <PasswordStrengthIndicator
 *   password="MyPassword123!"
 *   validation={validationResult}
 *   showRequirements={true}
 * />
 * ```
 * 
 * @example With Validation Service
 * ```typescript
 * const [validation, setValidation] = useState<PasswordValidationResult>();
 * 
 * useEffect(() => {
 *   if (password) {
 *     passwordService.validatePassword(password)
 *       .then(setValidation);
 *   }
 * }, [password]);
 * 
 * return (
 *   <PasswordStrengthIndicator
 *     password={password}
 *     validation={validation}
 *     showRequirements={true}
 *   />
 * );
 * ```
 */
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  validation,
  showRequirements = true,
}) => {
  const authT = useAuthTranslations();

  // Don't render if no password provided
  if (!password) return null;

  /**
   * Get localized strength text based on validation result
   */
  const getStrengthText = useMemo(() => {
    if (!validation) return '';
    
    return authT.passwordStrength.strength[validation.strength as keyof typeof authT.passwordStrength.strength] || '';
  }, [validation, authT.passwordStrength.strength]);

  /**
   * Get strength color based on validation result
   */
  const getStrengthColor = useMemo(() => {
    if (!validation) return strengthColors.very_weak;
    
    return strengthColors[validation.strength as keyof typeof strengthColors] || strengthColors.very_weak;
  }, [validation]);

  /**
   * Generate requirement checks based on password content
   */
  const requirements = useMemo(() => [
    {
      text: authT.passwordStrength.requirements.minLength,
      met: password.length >= 8,
    },
    {
      text: authT.passwordStrength.requirements.uppercase,
      met: /[A-Z]/.test(password),
    },
    {
      text: authT.passwordStrength.requirements.lowercase,
      met: /[a-z]/.test(password),
    },
    {
      text: authT.passwordStrength.requirements.numbers,
      met: /\d/.test(password),
    },
    {
      text: authT.passwordStrength.requirements.specialChars,
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ], [password, authT.passwordStrength.requirements]);

  // Don't render if no validation data
  if (!validation) return null;

  return (
    <View style={styles.container}>
      {/* Strength Bar */}
      <View style={styles.strengthBarContainer}>
        <View style={styles.strengthBarBackground}>
          <View
            style={[
              styles.strengthBarFill,
              {
                width: `${validation.score}%`,
                backgroundColor: getStrengthColor,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.strengthText,
            { color: getStrengthColor },
          ]}
        >
          {authT.passwordStrength.score(getStrengthText, validation.score)}
        </Text>
      </View>

      {/* Requirements List */}
      {showRequirements && (
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>
            {authT.passwordStrength.requirements.title}
          </Text>

          {requirements.map((requirement, index) => (
            <RequirementItem
              key={index}
              text={requirement.text}
              met={requirement.met}
            />
          ))}
        </View>
      )}

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {validation.errors.map((error: string, index: number) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * @component RequirementItem
 * @description Individual password requirement with status indicator
 * 
 * @param {RequirementItemProps} props - Component props
 * @returns {JSX.Element} Requirement item with icon and text
 */
const RequirementItem: React.FC<RequirementItemProps> = ({ text, met }) => (
  <View style={styles.requirementItem}>
    <Text
      style={[
        styles.requirementIcon,
        { color: met ? requirementColors.met : requirementColors.notMet },
      ]}
    >
      {met ? '✓' : '○'}
    </Text>
    <Text
      style={[
        styles.requirementText,
        { color: met ? requirementColors.met : requirementColors.notMet },
      ]}
    >
      {text}
    </Text>
  </View>
); 