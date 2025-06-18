/**
 * @fileoverview Auth Service Container - Vollständiger Mock für Tests
 */

export const AuthServiceContainer = { 
  // Repository Methods
  getAuthRepository: jest.fn().mockReturnValue({ 
    signInWithEmailAndPassword: jest.fn().mockResolvedValue(null), 
    signUp: jest.fn().mockResolvedValue(null), 
    signOut: jest.fn().mockResolvedValue(null), 
    getCurrentUser: jest.fn().mockResolvedValue(null),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(null),
    onAuthStateChanged: jest.fn(),
  }),
  
  // DataSource Methods
  getAuthDataSource: jest.fn().mockReturnValue({
    signInWithEmailAndPassword: jest.fn().mockResolvedValue(null),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue(null),
    signOut: jest.fn().mockResolvedValue(null),
    getCurrentUser: jest.fn().mockResolvedValue(null),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(null),
    onAuthStateChanged: jest.fn(),
  }),
  
  // Container Lifecycle Methods
  resetInstance: jest.fn(),
  reset: jest.fn(),
  getInstance: jest.fn(),
  
  // Enterprise Service Methods
  getMfaService: jest.fn(),
  getComplianceService: jest.fn(),
  getPasswordPolicyService: jest.fn(),
};

export default AuthServiceContainer;
