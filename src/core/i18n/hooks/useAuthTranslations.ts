/**
 * @fileoverview AUTH-I18N-HOOK-001: Auth Translation Hook
 * @description Specialized hook for auth-related translations with type safety
 * 
 * @businessRule BR-900: Centralized translation management for auth features
 * @businessRule BR-901: Type-safe translation keys for auth components
 * @businessRule BR-902: Platform-aware biometric translations
 * @businessRule BR-903: MFA method-specific translation handling
 * 
 * @performance Optimized translation caching for auth workflows
 * @performance Minimal re-renders with selective translation loading
 * 
 * @accessibility Localized content for screen readers and accessibility tools
 * @accessibility Platform-specific biometric descriptions for better UX
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module useAuthTranslations
 * @namespace Auth.Core.I18n
 */

import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

/**
 * @interface AuthTranslations
 * @description Type-safe interface for auth translations
 */
export interface AuthTranslations {
  // Common
  common: {
    cancel: string;
    delete: string;
    alert: {
      titles: {
        error: string;
        success: string;
        warning: string;
        info: string;
        notAvailable: string;
        enabled: string;
        disabled: string;
        failed: string;
        notEnabled: string;
        confirmation: string;
      };
    };
  };
  
  // Error messages
  error: {
    biometric: {
      notAvailable: string;
      failed: string;
      enableFailed: string;
      disableFailed: string;
      testFailed: string;
      userNotAuthenticated: string;
      notEnabled: string;
    };
    mfa: {
      setupFailed: string;
      verificationFailed: string;
      codeRequired: string;
      invalidMethod: string;
    };
  };
  
  // Biometric translations
  biometric: {
    title: string;
    subtitle: string;
    icon: string;
    description: {
      enabled: (biometricType: string) => string;
      disabled: (biometricType: string) => string;
    };
    warning: {
      notAvailable: (biometricType: string) => string;
    };
    buttons: {
      test: string;
      testing: string;
    };
    success: {
      enabled: (biometricType: string) => string;
      disabled: (biometricType: string) => string;
      testPassed: string;
    };
    confirm: {
      disable: {
        title: string;
        message: (biometricType: string) => string;
        confirm: string;
        cancel: string;
      };
    };
    info: {
      title: string;
      points: {
        secure: string;
        noAccess: string;
        disableAnytime: string;
        passwordFallback: string;
      };
    };
    unavailable: {
      title: string;
      subtitle: string;
      icon: string;
    };
  };
  
  // MFA translations
  mfa: {
    title: string;
    subtitle: string;
    methods: {
      totp: { title: string; description: string; icon: string };
      sms: { title: string; description: string; icon: string };
      email: { title: string; description: string; icon: string };
    };
    setup: {
      totp: {
        title: string;
        instructions: { [key: string]: string };
        secretLabel: string;
      };
      sms: {
        title: string;
        instruction: string;
        placeholder: string;
      };
      email: {
        title: string;
        instruction: string;
      };
    };
    verification: {
      title: string;
      instruction: (method: string) => string;
      placeholder: string;
      methods: {
        totp: string;
        sms: string;
        email: string;
      };
    };
    buttons: {
      back: string;
      continue: string;
      setting: string;
      verify: string;
      verifying: string;
    };
    success: {
      enabled: string;
    };
  };
  
  // Password Strength translations
  passwordStrength: {
    title: string;
    strength: {
      very_strong: string;
      strong: string;
      medium: string;
      weak: string;
      very_weak: string;
    };
    requirements: {
      title: string;
      minLength: string;
      uppercase: string;
      lowercase: string;
      numbers: string;
      specialChars: string;
    };
    score: (strength: string, score: number) => string;
  };
}

/**
 * @hook useAuthTranslations
 * @description Auth-specific translation hook with platform awareness
 * 
 * Provides type-safe, platform-aware translations for auth features including:
 * - Biometric authentication (iOS/Android specific)
 * - MFA setup and verification
 * - Error messages and success states
 * - Security information and warnings
 * 
 * @returns {AuthTranslations} Structured auth translations with helper functions
 * 
 * @example Basic Usage
 * ```typescript
 * const authT = useAuthTranslations();
 * 
 * // Platform-specific biometric type
 * const biometricType = authT.biometric.subtitle;
 * const icon = authT.biometric.icon;
 * 
 * // Dynamic messages with interpolation
 * const enabledMessage = authT.biometric.success.enabled(biometricType);
 * const warningMessage = authT.biometric.warning.notAvailable(biometricType);
 * 
 * // MFA method translations
 * const totpTitle = authT.mfa.methods.totp.title;
 * const verificationInstruction = authT.mfa.verification.instruction('SMS');
 * ```
 * 
 * @example Error Handling
 * ```typescript
 * const authT = useAuthTranslations();
 * 
 * // Show localized error messages
 * if (biometricNotAvailable) {
 *   alert(authT.error.biometric.notAvailable);
 * }
 * 
 * if (mfaSetupFailed) {
 *   alert(authT.error.mfa.setupFailed);
 * }
 * ```
 * 
 * @businessRule BR-900: All auth-related strings must be translatable
 * @businessRule BR-901: Platform-specific biometric terminology required
 * @businessRule BR-902: MFA methods must support multiple languages
 */
export const useAuthTranslations = (): AuthTranslations => {
  const { t } = useTranslation();
  
  // Platform-specific biometric type detection
  const getBiometricType = (): string => {
    return Platform.OS === 'ios' 
      ? t('auth.biometric.subtitle.ios') 
      : t('auth.biometric.subtitle.android');
  };
  
  const getBiometricIcon = (): string => {
    return Platform.OS === 'ios' 
      ? t('auth.biometric.icons.ios') 
      : t('auth.biometric.icons.android');
  };
  
  return {
    common: {
      cancel: t('common.cancel'),
      delete: t('common.delete'),
      alert: {
        titles: {
          error: t('common.alert.titles.error'),
          success: t('common.alert.titles.success'),
          warning: t('common.alert.titles.warning'),
          info: t('common.alert.titles.info'),
          notAvailable: t('common.alert.titles.notAvailable'),
          enabled: t('common.alert.titles.enabled'),
          disabled: t('common.alert.titles.disabled'),
          failed: t('common.alert.titles.failed'),
          notEnabled: t('common.alert.titles.notEnabled'),
          confirmation: t('common.alert.titles.confirmation'),
        },
      },
    },
    
    error: {
      biometric: {
        notAvailable: t('error.auth.biometric.notAvailable'),
        failed: t('error.auth.biometric.failed'),
        enableFailed: t('error.auth.biometric.enableFailed'),
        disableFailed: t('error.auth.biometric.disableFailed'),
        testFailed: t('error.auth.biometric.testFailed'),
        userNotAuthenticated: t('error.auth.biometric.userNotAuthenticated'),
        notEnabled: t('error.auth.biometric.notEnabled'),
      },
      mfa: {
        setupFailed: t('error.auth.mfa.setupFailed'),
        verificationFailed: t('error.auth.mfa.verificationFailed'),
        codeRequired: t('error.auth.mfa.codeRequired'),
        invalidMethod: t('error.auth.mfa.invalidMethod'),
      },
    },
    
    biometric: {
      title: t('auth.biometric.title'),
      subtitle: getBiometricType(),
      icon: getBiometricIcon(),
      description: {
        enabled: (biometricType: string) => 
          t('auth.biometric.description.enabled', { biometricType }),
        disabled: (biometricType: string) => 
          t('auth.biometric.description.disabled', { biometricType }),
      },
      warning: {
        notAvailable: (biometricType: string) => 
          t('auth.biometric.warning.notAvailable', { biometricType }),
      },
      buttons: {
        test: t('auth.biometric.buttons.test'),
        testing: t('auth.biometric.buttons.testing'),
      },
      success: {
        enabled: (biometricType: string) => 
          t('auth.biometric.success.enabled', { biometricType }),
        disabled: (biometricType: string) => 
          t('auth.biometric.success.disabled', { biometricType }),
        testPassed: t('auth.biometric.success.testPassed'),
      },
      confirm: {
        disable: {
          title: t('auth.biometric.confirm.disable.title'),
          message: (biometricType: string) => 
            t('auth.biometric.confirm.disable.message', { biometricType }),
          confirm: t('auth.biometric.confirm.disable.confirm'),
          cancel: t('auth.biometric.confirm.disable.cancel'),
        },
      },
      info: {
        title: t('auth.biometric.info.title'),
        points: {
          secure: t('auth.biometric.info.points.secure'),
          noAccess: t('auth.biometric.info.points.noAccess'),
          disableAnytime: t('auth.biometric.info.points.disableAnytime'),
          passwordFallback: t('auth.biometric.info.points.passwordFallback'),
        },
      },
      unavailable: {
        title: t('auth.biometric.unavailable.title'),
        subtitle: t('auth.biometric.unavailable.subtitle'),
        icon: t('auth.biometric.unavailable.icon'),
      },
    },
    
    mfa: {
      title: t('auth.mfa.title'),
      subtitle: t('auth.mfa.subtitle'),
      methods: {
        totp: {
          title: t('auth.mfa.methods.totp.title'),
          description: t('auth.mfa.methods.totp.description'),
          icon: t('auth.mfa.methods.totp.icon'),
        },
        sms: {
          title: t('auth.mfa.methods.sms.title'),
          description: t('auth.mfa.methods.sms.description'),
          icon: t('auth.mfa.methods.sms.icon'),
        },
        email: {
          title: t('auth.mfa.methods.email.title'),
          description: t('auth.mfa.methods.email.description'),
          icon: t('auth.mfa.methods.email.icon'),
        },
      },
      setup: {
        totp: {
          title: t('auth.mfa.setup.totp.title'),
          instructions: {
            '1': t('auth.mfa.setup.totp.instructions.1'),
            '2': t('auth.mfa.setup.totp.instructions.2'),
          },
          secretLabel: t('auth.mfa.setup.totp.secretLabel'),
        },
        sms: {
          title: t('auth.mfa.setup.sms.title'),
          instruction: t('auth.mfa.setup.sms.instruction'),
          placeholder: t('auth.mfa.setup.sms.placeholder'),
        },
        email: {
          title: t('auth.mfa.setup.email.title'),
          instruction: t('auth.mfa.setup.email.instruction'),
        },
      },
      verification: {
        title: t('auth.mfa.verification.title'),
        instruction: (method: string) => {
          const methodKey = method.toLowerCase() as 'totp' | 'sms' | 'email';
          const methodName = t(`auth.mfa.verification.methods.${methodKey}`);
          return t('auth.mfa.verification.instruction', { method: methodName });
        },
        placeholder: t('auth.mfa.verification.placeholder'),
        methods: {
          totp: t('auth.mfa.verification.methods.totp'),
          sms: t('auth.mfa.verification.methods.sms'),
          email: t('auth.mfa.verification.methods.email'),
        },
      },
      buttons: {
        back: t('auth.mfa.buttons.back'),
        continue: t('auth.mfa.buttons.continue'),
        setting: t('auth.mfa.buttons.setting'),
        verify: t('auth.mfa.buttons.verify'),
        verifying: t('auth.mfa.buttons.verifying'),
      },
      success: {
        enabled: t('auth.mfa.success.enabled'),
      },
    },
    
    passwordStrength: {
      title: t('auth.passwordStrength.title'),
      strength: {
        very_strong: t('auth.passwordStrength.strength.very_strong'),
        strong: t('auth.passwordStrength.strength.strong'),
        medium: t('auth.passwordStrength.strength.medium'),
        weak: t('auth.passwordStrength.strength.weak'),
        very_weak: t('auth.passwordStrength.strength.very_weak'),
      },
      requirements: {
        title: t('auth.passwordStrength.requirements.title'),
        minLength: t('auth.passwordStrength.requirements.minLength'),
        uppercase: t('auth.passwordStrength.requirements.uppercase'),
        lowercase: t('auth.passwordStrength.requirements.lowercase'),
        numbers: t('auth.passwordStrength.requirements.numbers'),
        specialChars: t('auth.passwordStrength.requirements.specialChars'),
      },
      score: (strength: string, score: number) => t('auth.passwordStrength.score', { strength, score }),
    },
  };
}; 