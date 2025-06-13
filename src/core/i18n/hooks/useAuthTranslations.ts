/**
 * @fileoverview AUTH-I18N-HOOK-001: Auth Translation Hook - SIMPLIFIED
 * @description Simplified hook for auth-related translations - DIRECT MAPPING
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
  
  // Login translations
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    button: string;
    biometricButton: string;
    orText: string;
    socialText: string;
    success: string;
  };
  
  // Register translations
  register: {
    title: string;
    subtitle: string;
    firstNameLabel: string;
    lastNameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    button: string;
    success: string;
    successTitle: string;
    emailConfirmationMessage: string;
    verificationMessage: string;
    redirectingToLogin: string;
    socialText: string;
    errorTitle: string;
    errorMessage: string;
    emailSentTitle: string;
    emailSentMessage: string;
    nextStepsTitle: string;
    step1: string;
    step2: string;
    step3: string;
    continueToLogin: string;
  };
  
  // Password reset translations
  reset: {
    title: string;
    subtitle: string;
    emailLabel: string;
    button: string;
    success: string;
  };
  
  // Navigation translations
  navigation: {
    noAccount: string;
    forgotPassword: string;
    alreadyAccount: string;
    backToLogin: string;
  };
  
  // Validation translations
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordMismatch: string;
    firstNameRequired: string;
    firstNameTooShort: string;
    lastNameRequired: string;
    lastNameTooShort: string;
    passwordWeak: string;
    confirmPasswordRequired: string;
    passwordsMismatch: string;
    termsRequired: string;
    privacyRequired: string;
  };
  
  // OAuth translations
  oauth: {
    errorTitle: string;
    googleErrorMessage: string;
    appleErrorMessage: string;
    microsoftErrorMessage: string;
  };
  
  // Forgot password translations
  forgotPassword: {
    errorTitle: string;
    errorMessage: string;
  };
  
  // Terms and privacy translations
  terms: {
    acceptTerms: string;
    acceptPrivacy: string;
    termsOfService: string;
    privacyPolicy: string;
  };
  
  // Email verification translations
  emailVerification: {
    title: string;
    subtitle: string;
    description: string;
    resendButton: string;
    changeEmail: string;
    loginButton: string;
    checkingEmail: string;
    emailSent: string;
    emailSentError: string;
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
    errorTitle: string;
    errorMessage: string;
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
    errorTitle: string;
    setupErrorMessage: string;
    verificationErrorMessage: string;
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
  
  // Password translations
  password: {
    weak: string;
    fair: string;
    good: string;
    strong: string;
  };
}

/**
 * @hook useAuthTranslations - SIMPLIFIED VERSION
 * @description Direct mapping to i18n keys - NO COMPLEX ABSTRACTIONS
 */
export const useAuthTranslations = () => {
  const { t } = useTranslation();

  return {
    // Common
    common: {
      cancel: t('common.cancel', { defaultValue: 'Abbrechen' }),
      delete: t('common.delete', { defaultValue: 'Löschen' }),
      alert: {
        titles: {
          error: t('common.alert.titles.error', { defaultValue: 'Fehler' }),
          success: t('common.alert.titles.success', { defaultValue: 'Erfolg' }),
          warning: t('common.alert.titles.warning', { defaultValue: 'Warnung' }),
          info: t('common.alert.titles.info', { defaultValue: 'Information' }),
          notAvailable: t('common.alert.titles.notAvailable', { defaultValue: 'Nicht verfügbar' }),
          enabled: t('common.alert.titles.enabled', { defaultValue: 'Aktiviert' }),
          disabled: t('common.alert.titles.disabled', { defaultValue: 'Deaktiviert' }),
          failed: t('common.alert.titles.failed', { defaultValue: 'Fehlgeschlagen' }),
          notEnabled: t('common.alert.titles.notEnabled', { defaultValue: 'Nicht aktiviert' }),
          confirmation: t('common.alert.titles.confirmation', { defaultValue: 'Bestätigung' }),
        },
      },
    },

    // Login
    login: {
      title: t('auth.loginScreen.title', { defaultValue: 'Anmelden' }),
      subtitle: t('auth.loginScreen.subtitle', { defaultValue: 'Willkommen zurück! Melden Sie sich mit Ihrem Konto an.' }),
      emailLabel: t('auth.loginScreen.emailLabel', { defaultValue: 'E-Mail' }),
      passwordLabel: t('auth.loginScreen.passwordLabel', { defaultValue: 'Passwort' }),
      button: t('auth.loginScreen.button', { defaultValue: 'Anmelden' }),
      biometricButton: t('auth.loginScreen.biometricButton', { defaultValue: 'Mit Biometrie anmelden' }),
      orText: t('auth.loginScreen.orText', { defaultValue: 'oder' }),
      socialText: t('auth.loginScreen.socialText', { defaultValue: 'Mit sozialen Netzwerken anmelden' }),
      success: t('auth.loginScreen.success', { defaultValue: 'Erfolgreich eingeloggt' }),
    },

    // Register
    register: {
      title: t('auth.registerScreen.title', { defaultValue: 'Registrieren' }),
      subtitle: t('auth.registerScreen.subtitle', { defaultValue: 'Erstellen Sie Ihr neues Konto' }),
      firstNameLabel: t('auth.registerScreen.firstNameLabel', { defaultValue: 'Vorname' }),
      lastNameLabel: t('auth.registerScreen.lastNameLabel', { defaultValue: 'Nachname' }),
      emailLabel: t('auth.registerScreen.emailLabel', { defaultValue: 'E-Mail' }),
      passwordLabel: t('auth.registerScreen.passwordLabel', { defaultValue: 'Passwort' }),
      confirmPasswordLabel: t('auth.registerScreen.confirmPasswordLabel', { defaultValue: 'Passwort bestätigen' }),
      button: t('auth.registerScreen.button', { defaultValue: 'Registrieren' }),
      success: t('auth.registerScreen.success', { defaultValue: 'Registrierung erfolgreich!' }),
      successTitle: t('auth.registerScreen.successTitle', { defaultValue: 'Registrierung erfolgreich!' }),
      emailConfirmationMessage: t('auth.registerScreen.emailConfirmationMessage', { defaultValue: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails, um Ihr Konto zu bestätigen.' }),
      verificationMessage: t('auth.registerScreen.verificationMessage', { defaultValue: 'Prüfen Sie Ihr E-Mail-Postfach zur Verifizierung.' }),
      redirectingToLogin: t('auth.registerScreen.redirectingToLogin', { defaultValue: 'Weiterleitung zur Anmeldeseite...' }),
      socialText: t('auth.registerScreen.socialText', { defaultValue: 'Mit sozialen Netzwerken registrieren' }),
      errorTitle: t('auth.registerScreen.errorTitle', { defaultValue: 'Registrierung fehlgeschlagen' }),
      errorMessage: t('auth.registerScreen.errorMessage', { defaultValue: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' }),
      emailSentTitle: t('auth.registerScreen.emailSentTitle', { defaultValue: 'Bestätigungs-E-Mail gesendet!' }),
      emailSentMessage: t('auth.registerScreen.emailSentMessage', { defaultValue: 'Wir haben eine Bestätigungs-E-Mail gesendet.' }),
      nextStepsTitle: t('auth.registerScreen.nextStepsTitle', { defaultValue: 'Nächste Schritte:' }),
      step1: t('auth.registerScreen.step1', { defaultValue: 'Prüfen Sie Ihr E-Mail-Postfach' }),
      step2: t('auth.registerScreen.step2', { defaultValue: 'Klicken Sie auf den Bestätigungslink' }),
      step3: t('auth.registerScreen.step3', { defaultValue: 'Melden Sie sich mit Ihrem neuen Konto an' }),
      continueToLogin: t('auth.registerScreen.continueToLogin', { defaultValue: 'Zur Anmeldung' }),
    },

    // Reset
    reset: {
      title: t('auth.resetScreen.title', { defaultValue: 'Passwort zurücksetzen' }),
      subtitle: t('auth.resetScreen.subtitle', { defaultValue: 'Geben Sie Ihre E-Mail-Adresse ein, um einen Zurücksetzungslink zu erhalten.' }),
      emailLabel: t('auth.resetScreen.emailLabel', { defaultValue: 'E-Mail' }),
      button: t('auth.resetScreen.button', { defaultValue: 'Link senden' }),
      success: t('auth.resetScreen.success', { defaultValue: 'E-Mail zum Zurücksetzen wurde gesendet' }),
    },

    // Navigation
    navigation: {
      noAccount: t('auth.authNavigation.noAccount', { defaultValue: 'Noch keinen Account? Jetzt registrieren!' }),
      forgotPassword: t('auth.authNavigation.forgotPassword', { defaultValue: 'Passwort vergessen?' }),
      alreadyAccount: t('auth.authNavigation.alreadyAccount', { defaultValue: 'Schon einen Account? Jetzt anmelden!' }),
      backToLogin: t('auth.authNavigation.backToLogin', { defaultValue: 'Zurück zum Login' }),
    },

    // Validation
    validation: {
      emailRequired: t('auth.loginScreen.errors.emailRequired', { defaultValue: 'E-Mail ist erforderlich' }),
      emailInvalid: t('auth.loginScreen.errors.emailInvalid', { defaultValue: 'Ungültige E-Mail-Adresse' }),
      passwordRequired: t('auth.loginScreen.errors.passwordRequired', { defaultValue: 'Passwort ist erforderlich' }),
      passwordTooShort: t('auth.registerScreen.errors.passwordTooShort', { defaultValue: 'Passwort muss mindestens 8 Zeichen lang sein' }),
      passwordMismatch: t('auth.registerScreen.errors.passwordMismatch', { defaultValue: 'Passwörter stimmen nicht überein' }),
      firstNameRequired: t('auth.registerScreen.errors.firstNameRequired', { defaultValue: 'Vorname ist erforderlich' }),
      firstNameTooShort: t('auth.registerScreen.errors.firstNameTooShort', { defaultValue: 'Vorname zu kurz (min. 2 Zeichen)' }),
      lastNameRequired: t('auth.registerScreen.errors.lastNameRequired', { defaultValue: 'Nachname ist erforderlich' }),
      lastNameTooShort: t('auth.registerScreen.errors.lastNameTooShort', { defaultValue: 'Nachname zu kurz (min. 2 Zeichen)' }),
      passwordWeak: t('auth.registerScreen.errors.passwordWeak', { defaultValue: 'Passwort entspricht nicht den Richtlinien' }),
      confirmPasswordRequired: t('auth.registerScreen.errors.confirmPasswordRequired', { defaultValue: 'Passwort bestätigen erforderlich' }),
      passwordsMismatch: t('auth.registerScreen.errors.passwordsMismatch', { defaultValue: 'Passwörter stimmen nicht überein' }),
      termsRequired: t('auth.registerScreen.errors.termsRequired', { defaultValue: 'Sie müssen den Nutzungsbedingungen zustimmen' }),
      privacyRequired: t('auth.registerScreen.errors.privacyRequired', { defaultValue: 'Sie müssen der Datenschutzerklärung zustimmen' }),
    },

    // OAuth
    oauth: {
      errorTitle: t('auth.oauthScreen.errorTitle', { defaultValue: 'OAuth Fehler' }),
      googleErrorMessage: t('auth.oauthScreen.googleErrorMessage', { defaultValue: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
      appleErrorMessage: t('auth.oauthScreen.appleErrorMessage', { defaultValue: 'Apple-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
      microsoftErrorMessage: t('auth.oauthScreen.microsoftErrorMessage', { defaultValue: 'Microsoft-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
    },

    // Biometric - SIMPLIFIED
    biometric: {
      title: t('auth.biometricScreen.title', { defaultValue: 'Biometrische Authentifizierung' }),
      subtitle: Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Fingerabdruck',
      icon: Platform.OS === 'ios' ? '🔒' : '👆',
      errorTitle: t('error.auth.biometric.failed', { defaultValue: 'Biometrische Authentifizierung fehlgeschlagen.' }),
      errorMessage: t('error.auth.biometric.notAvailable', { defaultValue: 'Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar oder nicht eingerichtet.' }),
      description: {
        enabled: (biometricType: string) => t('auth.biometricScreen.description.enabled', { biometricType, defaultValue: `Sie können sich mit ${biometricType} anmelden, ohne Ihr Passwort eingeben zu müssen.` }),
        disabled: (biometricType: string) => t('auth.biometricScreen.description.disabled', { biometricType, defaultValue: `Aktivieren Sie ${biometricType}, um sich schnell und sicher anzumelden.` }),
      },
      warning: {
        notAvailable: (biometricType: string) => t('auth.biometricScreen.warning.notAvailable', { biometricType, defaultValue: `${biometricType} ist auf diesem Gerät nicht verfügbar oder nicht eingerichtet. Bitte aktivieren Sie es in den Geräteeinstellungen.` }),
      },
      buttons: {
        test: t('auth.biometricScreen.buttons.test', { defaultValue: 'Biometrie testen' }),
        testing: t('auth.biometricScreen.buttons.testing', { defaultValue: 'Teste...' }),
      },
      success: {
        enabled: (biometricType: string) => t('auth.biometricScreen.success.enabled', { biometricType, defaultValue: `${biometricType} wurde erfolgreich aktiviert. Sie können sich jetzt mit Ihrer Biometrie anmelden.` }),
        disabled: (biometricType: string) => t('auth.biometricScreen.success.disabled', { biometricType, defaultValue: `${biometricType} wurde deaktiviert.` }),
        testPassed: t('auth.biometricScreen.success.testPassed', { defaultValue: 'Biometrische Authentifizierung erfolgreich!' }),
      },
      confirm: {
        disable: {
          title: t('auth.biometricScreen.confirm.disable.title', { defaultValue: 'Deaktivierung bestätigen' }),
          message: (biometricType: string) => t('auth.biometricScreen.confirm.disable.message', { biometricType, defaultValue: `Möchten Sie ${biometricType} wirklich deaktivieren?` }),
          confirm: t('auth.biometricScreen.confirm.disable.confirm', { defaultValue: 'Deaktivieren' }),
          cancel: t('auth.biometricScreen.confirm.disable.cancel', { defaultValue: 'Abbrechen' }),
        },
      },
      info: {
        title: t('auth.biometricScreen.info.title', { defaultValue: 'Sicherheitsinformationen:' }),
        points: {
          secure: t('auth.biometricScreen.info.points.secure', { defaultValue: 'Ihre biometrischen Daten werden sicher auf Ihrem Gerät gespeichert' }),
          noAccess: t('auth.biometricScreen.info.points.noAccess', { defaultValue: 'Wir haben keinen Zugriff auf Ihre biometrischen Daten' }),
          disableAnytime: t('auth.biometricScreen.info.points.disableAnytime', { defaultValue: 'Sie können diese Funktion jederzeit deaktivieren' }),
          passwordFallback: t('auth.biometricScreen.info.points.passwordFallback', { defaultValue: 'Sie können sich weiterhin mit Ihrem Passwort anmelden, falls es Probleme gibt' }),
        },
      },
      unavailable: {
        title: t('auth.biometricScreen.unavailable.title', { defaultValue: 'Login erforderlich' }),
        subtitle: t('auth.biometricScreen.unavailable.subtitle', { defaultValue: 'Melden Sie sich an, um biometrische Authentifizierung zu konfigurieren.' }),
        icon: t('auth.biometricScreen.unavailable.icon', { defaultValue: '🔒' }),
      },
    },

    // Forgot Password
    forgotPassword: {
      errorTitle: t('auth.resetScreen.errorTitle', { defaultValue: 'Fehler beim Zurücksetzen' }),
      errorMessage: t('auth.resetScreen.errorMessage', { defaultValue: 'Es gab ein Problem beim Zurücksetzen Ihres Passworts. Bitte versuchen Sie es erneut.' }),
    },

    // Terms and Privacy
    terms: {
      acceptTerms: t('auth.terms.acceptTerms', { defaultValue: 'Ich akzeptiere die Nutzungsbedingungen' }),
      acceptPrivacy: t('auth.terms.acceptPrivacy', { defaultValue: 'Ich akzeptiere die Datenschutzerklärung' }),
      termsOfService: t('auth.terms.termsOfService', { defaultValue: 'Nutzungsbedingungen' }),
      privacyPolicy: t('auth.terms.privacyPolicy', { defaultValue: 'Datenschutzerklärung' }),
    },

    // MFA
    mfa: {
      title: t('auth.mfaScreen.title', { defaultValue: 'Mehr-Faktor-Authentifizierung einrichten' }),
      subtitle: t('auth.mfaScreen.subtitle', { defaultValue: 'Erhöhen Sie Ihre Kontosicherheit' }),
      errorTitle: t('auth.mfaScreen.errors.title', { defaultValue: 'MFA-Fehler' }),
      setupErrorMessage: t('auth.mfaScreen.errors.setupFailed', { defaultValue: 'MFA Setup fehlgeschlagen' }),
      verificationErrorMessage: t('auth.mfaScreen.errors.verificationFailed', { defaultValue: 'Verifizierung fehlgeschlagen' }),
      methods: {
        totp: {
          title: t('auth.mfaScreen.methods.totp.title', { defaultValue: 'Authenticator App' }),
          description: t('auth.mfaScreen.methods.totp.description', { defaultValue: 'Nutzen Sie eine Authenticator App' }),
          icon: t('auth.mfaScreen.methods.totp.icon', { defaultValue: '📱' }),
        },
        sms: {
          title: t('auth.mfaScreen.methods.sms.title', { defaultValue: 'SMS' }),
          description: t('auth.mfaScreen.methods.sms.description', { defaultValue: 'Erhalten Sie Codes per SMS' }),
          icon: t('auth.mfaScreen.methods.sms.icon', { defaultValue: '📨' }),
        },
        email: {
          title: t('auth.mfaScreen.methods.email.title', { defaultValue: 'E-Mail' }),
          description: t('auth.mfaScreen.methods.email.description', { defaultValue: 'Erhalten Sie Codes per E-Mail' }),
          icon: t('auth.mfaScreen.methods.email.icon', { defaultValue: '📧' }),
        },
      },
      setup: {
        totp: {
          title: t('auth.mfaScreen.setup.totp.title', { defaultValue: 'Authenticator App einrichten' }),
          instructions: {
            '1': t('auth.mfaScreen.setup.totp.instructions.1', { defaultValue: '1. Installieren Sie eine Authenticator App' }),
            '2': t('auth.mfaScreen.setup.totp.instructions.2', { defaultValue: '2. Scannen Sie den QR-Code oder geben Sie den Schlüssel manuell ein' }),
          },
          secretLabel: t('auth.mfaScreen.setup.totp.secretLabel', { defaultValue: 'Geheimer Schlüssel:' }),
        },
        sms: {
          title: t('auth.mfaScreen.setup.sms.title', { defaultValue: 'SMS einrichten' }),
          instruction: t('auth.mfaScreen.setup.sms.instruction', { defaultValue: 'Geben Sie Ihre Telefonnummer ein:' }),
          placeholder: t('auth.mfaScreen.setup.sms.placeholder', { defaultValue: '+49 123 456789' }),
        },
        email: {
          title: t('auth.mfaScreen.setup.email.title', { defaultValue: 'E-Mail MFA einrichten' }),
          instruction: t('auth.mfaScreen.setup.email.instruction', { defaultValue: 'Codes werden an Ihre registrierte E-Mail-Adresse gesendet.' }),
        },
      },
      verification: {
        title: t('auth.mfaScreen.verification.title', { defaultValue: 'Code eingeben' }),
        instruction: (method: string) => t('auth.mfaScreen.verification.instruction', { method, defaultValue: `Wir haben einen Code an Ihre ${method} gesendet` }),
        placeholder: t('auth.mfaScreen.verification.placeholder', { defaultValue: '123456' }),
        methods: {
          totp: t('auth.mfaScreen.verification.methods.totp', { defaultValue: 'Authenticator App' }),
          sms: t('auth.mfaScreen.verification.methods.sms', { defaultValue: 'SMS' }),
          email: t('auth.mfaScreen.verification.methods.email', { defaultValue: 'E-Mail' }),
        },
      },
      buttons: {
        back: t('auth.mfaScreen.buttons.back', { defaultValue: 'Zurück' }),
        continue: t('auth.mfaScreen.buttons.continue', { defaultValue: 'Weiter' }),
        setting: t('auth.mfaScreen.buttons.setting', { defaultValue: 'Wird eingerichtet...' }),
        verify: t('auth.mfaScreen.buttons.verify', { defaultValue: 'Verifizieren' }),
        verifying: t('auth.mfaScreen.buttons.verifying', { defaultValue: 'Wird verifiziert...' }),
      },
      success: {
        enabled: t('auth.mfaScreen.success.enabled', { defaultValue: 'MFA wurde erfolgreich aktiviert!' }),
      },
    },

    // Password Strength
    passwordStrength: {
      title: t('auth.passwordStrengthScreen.title', { defaultValue: 'Passwort-Stärke' }),
      strength: {
        very_strong: t('auth.passwordStrengthScreen.strength.very_strong', { defaultValue: 'Sehr stark' }),
        strong: t('auth.passwordStrengthScreen.strength.strong', { defaultValue: 'Stark' }),
        medium: t('auth.passwordStrengthScreen.strength.medium', { defaultValue: 'Mittel' }),
        weak: t('auth.passwordStrengthScreen.strength.weak', { defaultValue: 'Schwach' }),
        very_weak: t('auth.passwordStrengthScreen.strength.very_weak', { defaultValue: 'Sehr schwach' }),
      },
      requirements: {
        title: t('auth.passwordStrengthScreen.requirements.title', { defaultValue: 'Passwort-Anforderungen:' }),
        minLength: t('auth.passwordStrengthScreen.requirements.minLength', { defaultValue: 'Mindestens 8 Zeichen' }),
        uppercase: t('auth.passwordStrengthScreen.requirements.uppercase', { defaultValue: 'Großbuchstaben (A-Z)' }),
        lowercase: t('auth.passwordStrengthScreen.requirements.lowercase', { defaultValue: 'Kleinbuchstaben (a-z)' }),
        numbers: t('auth.passwordStrengthScreen.requirements.numbers', { defaultValue: 'Zahlen (0-9)' }),
        specialChars: t('auth.passwordStrengthScreen.requirements.specialChars', { defaultValue: 'Sonderzeichen (!@#$%^&*)' }),
      },
      score: (strength: string, score: number) => t('auth.passwordStrengthScreen.score', { strength, score, defaultValue: `${strength} (${score}/100)` }),
    },

    // Password
    password: {
      weak: t('auth.passwordStrengthScreen.strength.weak', { defaultValue: 'Schwach' }),
      fair: t('auth.passwordStrengthScreen.strength.fair', { defaultValue: 'Angemessen' }),
      good: t('auth.passwordStrengthScreen.strength.good', { defaultValue: 'Gut' }),
      strong: t('auth.passwordStrengthScreen.strength.strong', { defaultValue: 'Stark' }),
    },

    // Email Verification
    emailVerification: {
      title: t('auth.emailVerificationScreen.title', { defaultValue: 'E-Mail verifizieren' }),
      subtitle: t('auth.emailVerificationScreen.subtitle', { defaultValue: 'Bestätigen Sie Ihre E-Mail-Adresse' }),
      description: t('auth.emailVerificationScreen.description', { defaultValue: 'Wir haben eine Bestätigungs-E-Mail an Ihre Adresse gesendet. Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.' }),
      resendButton: t('auth.emailVerificationScreen.resendButton', { defaultValue: 'E-Mail erneut senden' }),
      changeEmail: t('auth.emailVerificationScreen.changeEmail', { defaultValue: 'E-Mail-Adresse ändern' }),
      loginButton: t('auth.emailVerificationScreen.loginButton', { defaultValue: 'Zur Anmeldung' }),
      checkingEmail: t('auth.emailVerificationScreen.checkingEmail', { defaultValue: 'E-Mail wird überprüft...' }),
      emailSent: t('auth.emailVerificationScreen.emailSent', { defaultValue: 'E-Mail wurde gesendet' }),
      emailSentError: t('auth.emailVerificationScreen.emailSentError', { defaultValue: 'Fehler beim Senden der E-Mail' }),
    },

    // Error messages
    error: {
      biometric: {
        notAvailable: t('error.auth.biometric.notAvailable', { defaultValue: 'Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar oder nicht eingerichtet.' }),
        failed: t('error.auth.biometric.failed', { defaultValue: 'Biometrische Authentifizierung fehlgeschlagen.' }),
        enableFailed: t('error.auth.biometric.enableFailed', { defaultValue: 'Biometrische Authentifizierung konnte nicht aktiviert werden. Bitte versuchen Sie es erneut.' }),
        disableFailed: t('error.auth.biometric.disableFailed', { defaultValue: 'Deaktivierung fehlgeschlagen.' }),
        testFailed: t('error.auth.biometric.testFailed', { defaultValue: 'Biometrische Authentifizierung fehlgeschlagen.' }),
        userNotAuthenticated: t('error.auth.biometric.userNotAuthenticated', { defaultValue: 'Sie müssen angemeldet sein, um biometrische Authentifizierung zu aktivieren.' }),
        notEnabled: t('error.auth.biometric.notEnabled', { defaultValue: 'Biometrische Authentifizierung ist nicht aktiviert.' }),
      },
      mfa: {
        setupFailed: t('error.auth.mfa.setupFailed', { defaultValue: 'MFA Setup fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
        verificationFailed: t('error.auth.mfa.verificationFailed', { defaultValue: 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
        codeRequired: t('error.auth.mfa.codeRequired', { defaultValue: 'Bitte geben Sie den Verifizierungscode ein.' }),
        invalidMethod: t('error.auth.mfa.invalidMethod', { defaultValue: 'Ungültige MFA-Methode gewählt.' }),
      },
    },
  };
}; 