/**
 * @fileoverview SECURITY TESTING SETUP - Enterprise Industry Standard 2025
 * 
 * @description Advanced security testing utilities for React Native:
 * - OWASP Compliance Testing
 * - Input Sanitization Testing
 * - XSS & Injection Attack Prevention
 * - Authentication & Authorization Testing
 * - Data Encryption Testing
 * - Privacy & GDPR Compliance
 * - Security Vulnerability Detection
 * 
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

// ============================================================================
// SECURITY TESTING UTILITIES
// ============================================================================

interface SecurityTestResult {
  passed: boolean;
  vulnerabilities: SecurityVulnerability[];
  recommendations: string[];
  complianceScore: number;
}

interface SecurityVulnerability {
  type: 'XSS' | 'INJECTION' | 'INSECURE_STORAGE' | 'WEAK_ENCRYPTION' | 'PRIVACY_LEAK' | 'AUTH_BYPASS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location: string;
  recommendation: string;
}

// ============================================================================
// OWASP COMPLIANCE TESTING
// ============================================================================

class OWASPComplianceChecker {
  private vulnerabilities: SecurityVulnerability[] = [];

  /**
   * Test for XSS vulnerabilities in user input
   */
  testXSSVulnerability(input: string, sanitizedOutput: string): boolean {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')">',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      '"><script>alert("XSS")</script>',
      '\' OR 1=1 --',
      '<svg onload="alert(\'XSS\')">',
    ];

    const hasXSS = xssPayloads.some(payload => {
      const testInput = input.replace('{{PAYLOAD}}', payload);
      return sanitizedOutput.includes(payload) || 
             sanitizedOutput.includes('<script>') ||
             sanitizedOutput.includes('javascript:') ||
             sanitizedOutput.includes('onerror=') ||
             sanitizedOutput.includes('onload=');
    });

    if (hasXSS) {
      this.vulnerabilities.push({
        type: 'XSS',
        severity: 'HIGH',
        description: 'Potential XSS vulnerability detected in user input handling',
        location: 'Input sanitization function',
        recommendation: 'Implement proper input sanitization and output encoding',
      });
    }

    return !hasXSS;
  }

  /**
   * Test for SQL injection vulnerabilities
   */
  testSQLInjection(query: string, userInput: string): boolean {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "'; DELETE FROM users WHERE '1'='1",
      "' OR 1=1 --",
      "admin'--",
      "admin'/*",
    ];

    const hasInjection = sqlInjectionPayloads.some(payload => {
      const testInput = userInput.replace('{{PAYLOAD}}', payload);
      return query.includes(payload) || !query.includes('?') || !query.includes('$');
    });

    if (hasInjection) {
      this.vulnerabilities.push({
        type: 'INJECTION',
        severity: 'CRITICAL',
        description: 'Potential SQL injection vulnerability detected',
        location: 'Database query construction',
        recommendation: 'Use parameterized queries and prepared statements',
      });
    }

    return !hasInjection;
  }

  /**
   * Test for insecure data storage
   */
  testInsecureStorage(storageMethod: string, dataType: 'SENSITIVE' | 'PUBLIC'): boolean {
    const insecureMethods = ['localStorage', 'sessionStorage', 'AsyncStorage'];
    const isInsecure = dataType === 'SENSITIVE' && insecureMethods.includes(storageMethod);

    if (isInsecure) {
      this.vulnerabilities.push({
        type: 'INSECURE_STORAGE',
        severity: 'MEDIUM',
        description: 'Sensitive data stored in insecure location',
        location: `${storageMethod} usage`,
        recommendation: 'Use secure storage methods like Keychain for sensitive data',
      });
    }

    return !isInsecure;
  }

  /**
   * Test encryption strength
   */
  testEncryptionStrength(algorithm: string, keyLength: number): boolean {
    const weakAlgorithms = ['MD5', 'SHA1', 'DES', 'RC4'];
    const minKeyLength = 256;

    const hasWeakAlgorithm = weakAlgorithms.some(weak => 
      algorithm.toUpperCase().includes(weak)
    );
    const hasWeakKey = keyLength < minKeyLength;

    if (hasWeakAlgorithm || hasWeakKey) {
      this.vulnerabilities.push({
        type: 'WEAK_ENCRYPTION',
        severity: 'HIGH',
        description: `Weak encryption detected: ${algorithm} with ${keyLength}-bit key`,
        location: 'Encryption implementation',
        recommendation: 'Use strong encryption algorithms like AES-256',
      });
    }

    return !hasWeakAlgorithm && !hasWeakKey;
  }

  getVulnerabilities(): SecurityVulnerability[] {
    return [...this.vulnerabilities];
  }

  getComplianceScore(): number {
    const totalTests = 4; // XSS, Injection, Storage, Encryption
    const passedTests = totalTests - this.vulnerabilities.length;
    return (passedTests / totalTests) * 100;
  }

  reset(): void {
    this.vulnerabilities = [];
  }

  generateReport(): string {
    const score = this.getComplianceScore();
    const vulnerabilities = this.getVulnerabilities();
    
    return `OWASP Compliance Report:
    - Compliance Score: ${score.toFixed(1)}%
    - Vulnerabilities Found: ${vulnerabilities.length}
    - Critical: ${vulnerabilities.filter(v => v.severity === 'CRITICAL').length}
    - High: ${vulnerabilities.filter(v => v.severity === 'HIGH').length}
    - Medium: ${vulnerabilities.filter(v => v.severity === 'MEDIUM').length}
    - Low: ${vulnerabilities.filter(v => v.severity === 'LOW').length}`;
  }
}

// ============================================================================
// PRIVACY & GDPR COMPLIANCE TESTING
// ============================================================================

class PrivacyComplianceChecker {
  private privacyViolations: Array<{
    type: string;
    description: string;
    gdprArticle: string;
    severity: string;
  }> = [];

  /**
   * Test for PII (Personally Identifiable Information) handling
   */
  testPIIHandling(data: Record<string, any>, hasUserConsent: boolean): boolean {
    const piiFields = [
      'email', 'phone', 'ssn', 'address', 'firstName', 'lastName',
      'dateOfBirth', 'creditCard', 'passport', 'drivingLicense'
    ];

    const foundPII = Object.keys(data).filter(key => 
      piiFields.some(pii => key.toLowerCase().includes(pii.toLowerCase()))
    );

    if (foundPII.length > 0 && !hasUserConsent) {
      this.privacyViolations.push({
        type: 'PII_WITHOUT_CONSENT',
        description: `PII fields processed without consent: ${foundPII.join(', ')}`,
        gdprArticle: 'Article 6 (Lawfulness of processing)',
        severity: 'HIGH',
      });
      return false;
    }

    return true;
  }

  /**
   * Test for data retention compliance
   */
  testDataRetention(dataAge: number, retentionPeriod: number, purpose: string): boolean {
    if (dataAge > retentionPeriod) {
      this.privacyViolations.push({
        type: 'DATA_RETENTION_VIOLATION',
        description: `Data older than retention period: ${dataAge} days (limit: ${retentionPeriod} days)`,
        gdprArticle: 'Article 5 (Principles relating to processing)',
        severity: 'MEDIUM',
      });
      return false;
    }

    return true;
  }

  /**
   * Test for data minimization principle
   */
  testDataMinimization(collectedFields: string[], necessaryFields: string[]): boolean {
    const excessiveFields = collectedFields.filter(field => 
      !necessaryFields.includes(field)
    );

    if (excessiveFields.length > 0) {
      this.privacyViolations.push({
        type: 'DATA_MINIMIZATION_VIOLATION',
        description: `Excessive data collection: ${excessiveFields.join(', ')}`,
        gdprArticle: 'Article 5 (Data minimisation)',
        severity: 'MEDIUM',
      });
      return false;
    }

    return true;
  }

  getViolations() {
    return [...this.privacyViolations];
  }

  reset(): void {
    this.privacyViolations = [];
  }
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION TESTING
// ============================================================================

class AuthSecurityTester {
  /**
   * Test password strength
   */
  testPasswordStrength(password: string): {
    strength: 'WEAK' | 'MEDIUM' | 'STRONG';
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      issues.push('Password too short (minimum 8 characters)');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Character variety checks
    if (!/[a-z]/.test(password)) {
      issues.push('Missing lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('Missing uppercase letters');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      issues.push('Missing numbers');
    } else {
      score += 1;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      issues.push('Missing special characters');
    } else {
      score += 1;
    }

    // Common password check
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', '1234567890', 'password123'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      issues.push('Common password detected');
      score = 0;
    }

    let strength: 'WEAK' | 'MEDIUM' | 'STRONG';
    if (score <= 2) {
      strength = 'WEAK';
    } else if (score <= 4) {
      strength = 'MEDIUM';
    } else {
      strength = 'STRONG';
    }

    return { strength, issues };
  }

  /**
   * Test JWT token security
   */
  testJWTSecurity(token: string): {
    isSecure: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        issues.push('Invalid JWT format');
        return { isSecure: false, issues };
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      // Check algorithm
      if (header.alg === 'none') {
        issues.push('JWT uses no signature algorithm');
      }

      if (header.alg === 'HS256' && !header.kid) {
        issues.push('HMAC algorithm without key ID');
      }

      // Check expiration
      if (!payload.exp) {
        issues.push('JWT missing expiration claim');
      } else {
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        if (timeUntilExpiry < 0) {
          issues.push('JWT is expired');
        } else if (timeUntilExpiry > 24 * 60 * 60 * 1000) {
          issues.push('JWT expires too far in the future');
        }
      }

      // Check audience
      if (!payload.aud) {
        issues.push('JWT missing audience claim');
      }

      return { isSecure: issues.length === 0, issues };
    } catch (error) {
      issues.push('Invalid JWT token');
      return { isSecure: false, issues };
    }
  }
}

// ============================================================================
// GLOBAL SECURITY TEST UTILITIES
// ============================================================================

let globalOWASPChecker: OWASPComplianceChecker;
let globalPrivacyChecker: PrivacyComplianceChecker;
let globalAuthTester: AuthSecurityTester;

/**
 * Initialize security testing for current test
 */
global.initSecurityTest = (): void => {
  globalOWASPChecker = new OWASPComplianceChecker();
  globalPrivacyChecker = new PrivacyComplianceChecker();
  globalAuthTester = new AuthSecurityTester();
};

/**
 * Test for XSS vulnerabilities
 */
global.testXSSSecurity = (input: string, sanitizedOutput: string): boolean => {
  if (!globalOWASPChecker) {
    throw new Error('Security test not initialized. Call initSecurityTest() first.');
  }
  return globalOWASPChecker.testXSSVulnerability(input, sanitizedOutput);
};

/**
 * Test for SQL injection vulnerabilities
 */
global.testSQLInjectionSecurity = (query: string, userInput: string): boolean => {
  if (!globalOWASPChecker) {
    throw new Error('Security test not initialized. Call initSecurityTest() first.');
  }
  return globalOWASPChecker.testSQLInjection(query, userInput);
};

/**
 * Test password strength
 */
global.testPasswordStrength = (password: string) => {
  if (!globalAuthTester) {
    throw new Error('Security test not initialized. Call initSecurityTest() first.');
  }
  return globalAuthTester.testPasswordStrength(password);
};

/**
 * Test JWT token security
 */
global.testJWTSecurity = (token: string) => {
  if (!globalAuthTester) {
    throw new Error('Security test not initialized. Call initSecurityTest() first.');
  }
  return globalAuthTester.testJWTSecurity(token);
};

/**
 * Generate comprehensive security report
 */
global.generateSecurityReport = (): SecurityTestResult => {
  if (!globalOWASPChecker || !globalPrivacyChecker) {
    throw new Error('Security test not initialized. Call initSecurityTest() first.');
  }

  const owaspVulnerabilities = globalOWASPChecker.getVulnerabilities();
  const privacyViolations = globalPrivacyChecker.getViolations();
  const complianceScore = globalOWASPChecker.getComplianceScore();

  const allVulnerabilities = [
    ...owaspVulnerabilities,
    ...privacyViolations.map(v => ({
      type: v.type as any,
      severity: v.severity as any,
      description: v.description,
      location: 'Privacy compliance check',
      recommendation: `Ensure compliance with ${v.gdprArticle}`,
    })),
  ];

  const recommendations = [
    'Implement comprehensive input validation',
    'Use parameterized queries for database operations',
    'Store sensitive data in secure storage solutions',
    'Implement strong encryption algorithms',
    'Ensure GDPR compliance for all data processing',
    'Regular security audits and penetration testing',
  ];

  return {
    passed: allVulnerabilities.length === 0,
    vulnerabilities: allVulnerabilities,
    recommendations,
    complianceScore,
  };
};

// ============================================================================
// ENHANCED TYPE DECLARATIONS
// ============================================================================

declare global {
  var initSecurityTest: () => void;
  var testXSSSecurity: (input: string, sanitizedOutput: string) => boolean;
  var testSQLInjectionSecurity: (query: string, userInput: string) => boolean;
  var testPasswordStrength: (password: string) => {
    strength: 'WEAK' | 'MEDIUM' | 'STRONG';
    issues: string[];
  };
  var testJWTSecurity: (token: string) => {
    isSecure: boolean;
    issues: string[];
  };
  var generateSecurityReport: () => SecurityTestResult;
}

// ============================================================================
// SECURITY TEST CLEANUP
// ============================================================================

beforeEach(() => {
  global.initSecurityTest();
});

afterEach(() => {
  if (globalOWASPChecker) {
    const report = global.generateSecurityReport();
    
    if (!report.passed && process.env.JEST_SECURITY_STRICT === 'true') {
      const criticalVulns = report.vulnerabilities.filter(v => v.severity === 'CRITICAL');
      if (criticalVulns.length > 0) {
        throw new Error(`Critical security vulnerabilities detected: ${criticalVulns.map(v => v.description).join(', ')}`);
      }
    }
  }
  
  globalOWASPChecker = undefined as any;
  globalPrivacyChecker = undefined as any;
  globalAuthTester = undefined as any;
});

export {
  OWASPComplianceChecker,
  PrivacyComplianceChecker,
  AuthSecurityTester,
  type SecurityTestResult,
  type SecurityVulnerability,
}; 