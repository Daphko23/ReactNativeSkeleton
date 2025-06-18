export const AuthServiceFactory = {
  createAuthService: jest.fn(),
  getAuthRepository: jest.fn(),
  createForTesting: jest.fn().mockResolvedValue({
    getAuthRepository: jest.fn().mockReturnValue({
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
    }),
    getMfaService: jest.fn(),
    getComplianceService: jest.fn(),
    getPasswordPolicyService: jest.fn(),
    reset: jest.fn(),
  }),
  createForDevelopment: jest
    .fn()
    .mockResolvedValue({ getAuthRepository: jest.fn(), reset: jest.fn() }),
  createForProduction: jest
    .fn()
    .mockResolvedValue({ getAuthRepository: jest.fn(), reset: jest.fn() }),
};
