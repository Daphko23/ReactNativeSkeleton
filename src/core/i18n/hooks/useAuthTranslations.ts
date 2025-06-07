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
      title: t('auth.login.title', { defaultValue: 'Anmelden' }),
      subtitle: t('auth.login.subtitle', { defaultValue: 'Willkommen zurück! Melden Sie sich mit Ihrem Konto an.' }),
      emailLabel: t('auth.login.emailLabel', { defaultValue: 'E-Mail' }),
      passwordLabel: t('auth.login.passwordLabel', { defaultValue: 'Passwort' }),
      button: t('auth.login.button', { defaultValue: 'Anmelden' }),
      biometricButton: t('auth.login.biometricButton', { defaultValue: 'Mit Biometrie anmelden' }),
      orText: t('auth.login.orText', { defaultValue: 'oder' }),
      socialText: t('auth.login.socialText', { defaultValue: 'Mit sozialen Netzwerken anmelden' }),
      success: t('auth.login.success', { defaultValue: 'Erfolgreich eingeloggt' }),
    },

    // Register
    register: {
      title: t('auth.register.title', { defaultValue: 'Registrieren' }),
      subtitle: t('auth.register.subtitle', { defaultValue: 'Erstellen Sie Ihr neues Konto' }),
      firstNameLabel: t('auth.register.firstNameLabel', { defaultValue: 'Vorname' }),
      lastNameLabel: t('auth.register.lastNameLabel', { defaultValue: 'Nachname' }),
      emailLabel: t('auth.register.emailLabel', { defaultValue: 'E-Mail' }),
      passwordLabel: t('auth.register.passwordLabel', { defaultValue: 'Passwort' }),
      confirmPasswordLabel: t('auth.register.confirmPasswordLabel', { defaultValue: 'Passwort bestätigen' }),
      button: t('auth.register.button', { defaultValue: 'Registrieren' }),
      success: t('auth.register.success', { defaultValue: 'Registrierung erfolgreich!' }),
      successTitle: t('auth.register.successTitle', { defaultValue: 'Registrierung erfolgreich!' }),
      emailConfirmationMessage: t('auth.register.emailConfirmationMessage', { defaultValue: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails, um Ihr Konto zu bestätigen.' }),
      verificationMessage: t('auth.register.verificationMessage', { defaultValue: 'Prüfen Sie Ihr E-Mail-Postfach zur Verifizierung.' }),
      redirectingToLogin: t('auth.register.redirectingToLogin', { defaultValue: 'Weiterleitung zur Anmeldeseite...' }),
      socialText: t('auth.register.socialText', { defaultValue: 'Mit sozialen Netzwerken registrieren' }),
      errorTitle: t('auth.register.errorTitle', { defaultValue: 'Registrierung fehlgeschlagen' }),
      errorMessage: t('auth.register.errorMessage', { defaultValue: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' }),
      emailSentTitle: t('auth.register.emailSentTitle', { defaultValue: 'Bestätigungs-E-Mail gesendet!' }),
      emailSentMessage: t('auth.register.emailSentMessage', { defaultValue: 'Wir haben eine Bestätigungs-E-Mail gesendet.' }),
      nextStepsTitle: t('auth.register.nextStepsTitle', { defaultValue: 'Nächste Schritte:' }),
      step1: t('auth.register.step1', { defaultValue: 'Prüfen Sie Ihr E-Mail-Postfach' }),
      step2: t('auth.register.step2', { defaultValue: 'Klicken Sie auf den Bestätigungslink' }),
      step3: t('auth.register.step3', { defaultValue: 'Melden Sie sich mit Ihrem neuen Konto an' }),
      continueToLogin: t('auth.register.continueToLogin', { defaultValue: 'Zur Anmeldung' }),
    },

    // Reset
    reset: {
      title: t('auth.reset.title', { defaultValue: 'Passwort zurücksetzen' }),
      subtitle: t('auth.reset.subtitle', { defaultValue: 'Geben Sie Ihre E-Mail-Adresse ein, um einen Zurücksetzungslink zu erhalten.' }),
      emailLabel: t('auth.reset.emailLabel', { defaultValue: 'E-Mail' }),
      button: t('auth.reset.button', { defaultValue: 'Link senden' }),
      success: t('auth.reset.success', { defaultValue: 'E-Mail zum Zurücksetzen wurde gesendet' }),
    },

    // Navigation
    navigation: {
      noAccount: t('auth.navigation.noAccount', { defaultValue: 'Noch keinen Account? Jetzt registrieren!' }),
      forgotPassword: t('auth.navigation.forgotPassword', { defaultValue: 'Passwort vergessen?' }),
      alreadyAccount: t('auth.navigation.alreadyAccount', { defaultValue: 'Schon einen Account? Jetzt anmelden!' }),
      backToLogin: t('auth.navigation.backToLogin', { defaultValue: 'Zurück zum Login' }),
    },

    // Validation
    validation: {
      emailRequired: t('auth.validation.emailRequired', { defaultValue: 'E-Mail ist erforderlich' }),
      emailInvalid: t('auth.validation.emailInvalid', { defaultValue: 'Ungültige E-Mail-Adresse' }),
      passwordRequired: t('auth.validation.passwordRequired', { defaultValue: 'Passwort ist erforderlich' }),
      passwordTooShort: t('auth.validation.passwordTooShort', { defaultValue: 'Passwort muss mindestens 8 Zeichen lang sein' }),
      passwordMismatch: t('auth.validation.passwordMismatch', { defaultValue: 'Passwörter stimmen nicht überein' }),
      firstNameRequired: t('auth.validation.firstNameRequired', { defaultValue: 'Vorname ist erforderlich' }),
      firstNameTooShort: t('auth.validation.firstNameTooShort', { defaultValue: 'Vorname zu kurz (min. 2 Zeichen)' }),
      lastNameRequired: t('auth.validation.lastNameRequired', { defaultValue: 'Nachname ist erforderlich' }),
      lastNameTooShort: t('auth.validation.lastNameTooShort', { defaultValue: 'Nachname zu kurz (min. 2 Zeichen)' }),
      passwordWeak: t('auth.validation.passwordWeak', { defaultValue: 'Passwort entspricht nicht den Richtlinien' }),
      confirmPasswordRequired: t('auth.validation.confirmPasswordRequired', { defaultValue: 'Passwort bestätigen erforderlich' }),
      passwordsMismatch: t('auth.validation.passwordsMismatch', { defaultValue: 'Passwörter stimmen nicht überein' }),
      termsRequired: t('auth.validation.termsRequired', { defaultValue: 'Sie müssen den Nutzungsbedingungen zustimmen' }),
      privacyRequired: t('auth.validation.privacyRequired', { defaultValue: 'Sie müssen der Datenschutzerklärung zustimmen' }),
    },

    // OAuth
    oauth: {
      errorTitle: t('auth.oauth.errorTitle', { defaultValue: 'OAuth Fehler' }),
      googleErrorMessage: t('auth.oauth.googleErrorMessage', { defaultValue: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
      appleErrorMessage: t('auth.oauth.appleErrorMessage', { defaultValue: 'Apple-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
      microsoftErrorMessage: t('auth.oauth.microsoftErrorMessage', { defaultValue: 'Microsoft-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
    },

    // Biometric - SIMPLIFIED
    biometric: {
      title: t('auth.biometric.title', { defaultValue: 'Biometrische Authentifizierung' }),
      subtitle: Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Fingerabdruck',
      icon: Platform.OS === 'ios' ? '🔒' : '👆',
      errorTitle: t('error.auth.biometric.failed', { defaultValue: 'Biometrische Authentifizierung fehlgeschlagen.' }),
      errorMessage: t('error.auth.biometric.notAvailable', { defaultValue: 'Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar oder nicht eingerichtet.' }),
      description: {
        enabled: (biometricType: string) => t('auth.biometric.description.enabled', { biometricType, defaultValue: `Sie können sich mit ${biometricType} anmelden, ohne Ihr Passwort eingeben zu müssen.` }),
        disabled: (biometricType: string) => t('auth.biometric.description.disabled', { biometricType, defaultValue: `Aktivieren Sie ${biometricType}, um sich schnell und sicher anzumelden.` }),
      },
      warning: {
        notAvailable: (biometricType: string) => t('auth.biometric.warning.notAvailable', { biometricType, defaultValue: `${biometricType} ist auf diesem Gerät nicht verfügbar oder nicht eingerichtet. Bitte aktivieren Sie es in den Geräteeinstellungen.` }),
      },
      buttons: {
        test: t('auth.biometric.buttons.test', { defaultValue: 'Biometrie testen' }),
        testing: t('auth.biometric.buttons.testing', { defaultValue: 'Teste...' }),
      },
      success: {
        enabled: (biometricType: string) => t('auth.biometric.success.enabled', { biometricType, defaultValue: `${biometricType} wurde erfolgreich aktiviert. Sie können sich jetzt mit Ihrer Biometrie anmelden.` }),
        disabled: (biometricType: string) => t('auth.biometric.success.disabled', { biometricType, defaultValue: `${biometricType} wurde deaktiviert.` }),
        testPassed: t('auth.biometric.success.testPassed', { defaultValue: 'Biometrische Authentifizierung erfolgreich!' }),
      },
      confirm: {
        disable: {
          title: t('auth.biometric.confirm.disable.title', { defaultValue: 'Deaktivierung bestätigen' }),
          message: (biometricType: string) => t('auth.biometric.confirm.disable.message', { biometricType, defaultValue: `Möchten Sie ${biometricType} wirklich deaktivieren?` }),
          confirm: t('auth.biometric.confirm.disable.confirm', { defaultValue: 'Deaktivieren' }),
          cancel: t('auth.biometric.confirm.disable.cancel', { defaultValue: 'Abbrechen' }),
        },
      },
      info: {
        title: t('auth.biometric.info.title', { defaultValue: 'Sicherheitsinformationen:' }),
        points: {
          secure: t('auth.biometric.info.points.secure', { defaultValue: 'Ihre biometrischen Daten werden sicher auf Ihrem Gerät gespeichert' }),
          noAccess: t('auth.biometric.info.points.noAccess', { defaultValue: 'Wir haben keinen Zugriff auf Ihre biometrischen Daten' }),
          disableAnytime: t('auth.biometric.info.points.disableAnytime', { defaultValue: 'Sie können diese Funktion jederzeit deaktivieren' }),
          passwordFallback: t('auth.biometric.info.points.passwordFallback', { defaultValue: 'Sie können sich weiterhin mit Ihrem Passwort anmelden, falls es Probleme gibt' }),
        },
      },
      unavailable: {
        title: t('auth.biometric.unavailable.title', { defaultValue: 'Login erforderlich' }),
        subtitle: t('auth.biometric.unavailable.subtitle', { defaultValue: 'Melden Sie sich an, um biometrische Authentifizierung zu konfigurieren.' }),
        icon: t('auth.biometric.unavailable.icon', { defaultValue: '🔒' }),
      },
    },

    // Forgot Password
    forgotPassword: {
      errorTitle: t('forgotPassword.errorTitle', { defaultValue: 'Fehler beim Zurücksetzen' }),
      errorMessage: t('forgotPassword.errorMessage', { defaultValue: 'Es gab ein Problem beim Zurücksetzen Ihres Passworts. Bitte versuchen Sie es erneut.' }),
    },

    // Terms and Privacy
    terms: {
      acceptTerms: t('terms.acceptTerms', { defaultValue: 'Ich akzeptiere die Nutzungsbedingungen' }),
      acceptPrivacy: t('terms.acceptPrivacy', { defaultValue: 'Ich akzeptiere die Datenschutzerklärung' }),
      termsOfService: t('terms.termsOfService', { defaultValue: 'Nutzungsbedingungen' }),
      privacyPolicy: t('terms.privacyPolicy', { defaultValue: 'Datenschutzerklärung' }),
    },

    // MFA
    mfa: {
      title: t('mfa.setup.title', { defaultValue: 'Mehr-Faktor-Authentifizierung einrichten' }),
      subtitle: t('mfa.setup.subtitle', { defaultValue: 'Erhöhen Sie Ihre Kontosicherheit' }),
      errorTitle: t('mfa.errors.title', { defaultValue: 'MFA-Fehler' }),
      setupErrorMessage: t('mfa.errors.setupFailed', { defaultValue: 'MFA Setup fehlgeschlagen' }),
      verificationErrorMessage: t('mfa.errors.verificationFailed', { defaultValue: 'Verifizierung fehlgeschlagen' }),
      methods: {
        totp: {
          title: t('mfa.methods.totp.title', { defaultValue: 'Authenticator App' }),
          description: t('mfa.methods.totp.description', { defaultValue: 'Nutzen Sie eine Authenticator App' }),
          icon: t('mfa.methods.totp.icon', { defaultValue: '📱' }),
        },
        sms: {
          title: t('mfa.methods.sms.title', { defaultValue: 'SMS' }),
          description: t('mfa.methods.sms.description', { defaultValue: 'Erhalten Sie Codes per SMS' }),
          icon: t('mfa.methods.sms.icon', { defaultValue: '📨' }),
        },
        email: {
          title: t('mfa.methods.email.title', { defaultValue: 'E-Mail' }),
          description: t('mfa.methods.email.description', { defaultValue: 'Erhalten Sie Codes per E-Mail' }),
          icon: t('mfa.methods.email.icon', { defaultValue: '📧' }),
        },
      },
      setup: {
        totp: {
          title: t('mfa.setup.totp.title', { defaultValue: 'Authenticator App einrichten' }),
          instructions: {
            '1': t('mfa.setup.totp.instructions.1', { defaultValue: '1. Installieren Sie eine Authenticator App' }),
            '2': t('mfa.setup.totp.instructions.2', { defaultValue: '2. Scannen Sie den QR-Code oder geben Sie den Schlüssel manuell ein' }),
          },
          secretLabel: t('mfa.setup.totp.secretLabel', { defaultValue: 'Geheimer Schlüssel:' }),
        },
        sms: {
          title: t('mfa.setup.sms.title', { defaultValue: 'SMS einrichten' }),
          instruction: t('mfa.setup.sms.instruction', { defaultValue: 'Geben Sie Ihre Telefonnummer ein:' }),
          placeholder: t('mfa.setup.sms.placeholder', { defaultValue: '+49 123 456789' }),
        },
        email: {
          title: t('mfa.setup.email.title', { defaultValue: 'E-Mail MFA einrichten' }),
          instruction: t('mfa.setup.email.instruction', { defaultValue: 'Codes werden an Ihre registrierte E-Mail-Adresse gesendet.' }),
        },
      },
      verification: {
        title: t('mfa.verify.title', { defaultValue: 'Code eingeben' }),
        instruction: (method: string) => t('mfa.verify.description', { method, defaultValue: `Wir haben einen Code an Ihre ${method} gesendet` }),
        placeholder: t('mfa.verify.inputPlaceholder', { defaultValue: '123456' }),
        methods: {
          totp: t('mfa.verification.methods.totp', { defaultValue: 'Authenticator App' }),
          sms: t('mfa.verification.methods.sms', { defaultValue: 'SMS' }),
          email: t('mfa.verification.methods.email', { defaultValue: 'E-Mail' }),
        },
      },
      buttons: {
        back: t('mfa.buttons.back', { defaultValue: 'Zurück' }),
        continue: t('mfa.buttons.continue', { defaultValue: 'Weiter' }),
        setting: t('mfa.buttons.setting', { defaultValue: 'Wird eingerichtet...' }),
        verify: t('mfa.buttons.verify', { defaultValue: 'Verifizieren' }),
        verifying: t('mfa.buttons.verifying', { defaultValue: 'Wird verifiziert...' }),
      },
      success: {
        enabled: t('mfa.success.enabled', { defaultValue: 'MFA wurde erfolgreich aktiviert!' }),
      },
    },

    // Password Strength
    passwordStrength: {
      title: t('passwordStrengthScreen.title', { defaultValue: 'Passwort-Stärke' }),
      strength: {
        very_strong: t('passwordStrengthScreen.strength.very_strong', { defaultValue: 'Sehr stark' }),
        strong: t('passwordStrengthScreen.strength.strong', { defaultValue: 'Stark' }),
        medium: t('passwordStrengthScreen.strength.medium', { defaultValue: 'Mittel' }),
        weak: t('passwordStrengthScreen.strength.weak', { defaultValue: 'Schwach' }),
        very_weak: t('passwordStrengthScreen.strength.very_weak', { defaultValue: 'Sehr schwach' }),
      },
      requirements: {
        title: t('passwordStrengthScreen.requirements.title', { defaultValue: 'Passwort-Anforderungen:' }),
        minLength: t('passwordStrengthScreen.requirements.minLength', { defaultValue: 'Mindestens 8 Zeichen' }),
        uppercase: t('passwordStrengthScreen.requirements.uppercase', { defaultValue: 'Großbuchstaben (A-Z)' }),
        lowercase: t('passwordStrengthScreen.requirements.lowercase', { defaultValue: 'Kleinbuchstaben (a-z)' }),
        numbers: t('passwordStrengthScreen.requirements.numbers', { defaultValue: 'Zahlen (0-9)' }),
        specialChars: t('passwordStrengthScreen.requirements.specialChars', { defaultValue: 'Sonderzeichen (!@#$%^&*)' }),
      },
      score: (strength: string, score: number) => t('passwordStrengthScreen.score', { strength, score, defaultValue: `${strength} (${score}/100)` }),
    },

    // Password
    password: {
      weak: t('auth.password.weak', { defaultValue: 'Schwach' }),
      fair: t('auth.password.fair', { defaultValue: 'Angemessen' }),
      good: t('auth.password.good', { defaultValue: 'Gut' }),
      strong: t('auth.password.strong', { defaultValue: 'Stark' }),
    },

    // Email Verification
    emailVerification: {
      title: t('auth.emailVerification.title', { defaultValue: 'E-Mail verifizieren' }),
      subtitle: t('auth.emailVerification.subtitle', { defaultValue: 'Bestätigen Sie Ihre E-Mail-Adresse' }),
      description: t('auth.emailVerification.description', { defaultValue: 'Wir haben eine Bestätigungs-E-Mail an Ihre Adresse gesendet. Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.' }),
      resendButton: t('auth.emailVerification.resendButton', { defaultValue: 'E-Mail erneut senden' }),
      changeEmail: t('auth.emailVerification.changeEmail', { defaultValue: 'E-Mail-Adresse ändern' }),
      loginButton: t('auth.emailVerification.loginButton', { defaultValue: 'Zur Anmeldung' }),
      checkingEmail: t('auth.emailVerification.checkingEmail', { defaultValue: 'E-Mail wird überprüft...' }),
      emailSent: t('auth.emailVerification.emailSent', { defaultValue: 'E-Mail wurde gesendet' }),
      emailSentError: t('auth.emailVerification.emailSentError', { defaultValue: 'Fehler beim Senden der E-Mail' }),
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