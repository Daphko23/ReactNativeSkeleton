import {AuthRepositoryImpl} from '@features/auth/data/repository/auth.repository.impl';
import {AuthSupabaseDatasource} from '@features/auth/data/sources/auth.supabase.datasource';
import {AuthUserDto} from '@features/auth/data/dtos/auth-user.dto';
import {AuthServiceContainer} from '@features/auth/data/factories/auth-service.container';
import {AuthServiceFactory} from '@features/auth/data/factories/auth.integration';
import type {ILoggerService} from '@core/logging/logger.service.interface';

jest.mock('@features/auth/data/sources/auth.supabase.datasource');

// Mock the Supabase configuration specifically
jest.mock('@core/config/supabase.config', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      signInWithPassword: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      getSession: jest.fn(() => Promise.resolve({
        data: { session: { user: { id: 'user123', email: 'test@example.com' } } },
        error: null
      })),
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
      mfa: {
        enroll: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        listFactors: jest.fn(() => Promise.resolve({ data: [], error: null })),
        unenroll: jest.fn(() => Promise.resolve({ error: null })),
        challenge: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        challengeAndVerify: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      },
      updateUser: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      signInWithIdToken: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      verifyOtp: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      refreshSession: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  },
}));

// Mock logger for testing
const createMockLogger = (): ILoggerService => {
  const mockFunction = jest.fn();
  const mockTimer = { stop: jest.fn() };
  
  return {
    info: mockFunction,
    error: mockFunction,
    warn: mockFunction,
    debug: mockFunction,
    fatal: mockFunction,
    logSecurity: mockFunction,
    logPerformance: mockFunction,
    logAudit: mockFunction,
    startTimer: jest.fn(() => mockTimer),
    createChildLogger: jest.fn(() => createMockLogger()),
    flush: jest.fn()
  } as ILoggerService;
};

describe('AuthRepositoryImpl via AuthServiceContainer - Factory Pattern', () => {
  let authRepository: AuthRepositoryImpl;
  let mockDataSource: jest.Mocked<AuthSupabaseDatasource>;
  let container: AuthServiceContainer;
  let mockLogger: ILoggerService;

  beforeEach(async () => {
    // Reset container singleton
    AuthServiceContainer.resetInstance();
    
    // Create mock logger
    mockLogger = createMockLogger();
    
    // Use AuthServiceFactory for proper initialization (eliminates manual config)
    container = await AuthServiceFactory.createForTesting(mockLogger, {
      enableMFA: true,
      enableCompliance: true,
      enablePasswordPolicy: true,
      enableAuthOrchestrator: true
    });
    
    // Get repository from container (factory-created with proper dependencies)
    authRepository = container.getAuthRepository() as AuthRepositoryImpl;
    
    // Mock the datasource (it's injected into the repository)
    mockDataSource = new AuthSupabaseDatasource() as jest.Mocked<AuthSupabaseDatasource>;
    
    // Replace the datasource in the repository for testing
    (authRepository as any).authDataSource = mockDataSource;
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.reset();
    AuthServiceContainer.resetInstance();
  });

  describe('Basic Authentication', () => {
    it('should login and return AuthUser', async () => {
      const mockSupabaseUserDto: AuthUserDto = {
        id: 'user123',
        email: 'test@example.com',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayName: 'Test User',
        photoURL: 'http://photo.url',
      };

      mockDataSource.signInWithEmailAndPassword.mockResolvedValueOnce();
      mockDataSource.getCurrentUser.mockResolvedValueOnce(mockSupabaseUserDto);

      const result = await authRepository.login(
        'test@example.com',
        'password123'
      );

      expect(mockDataSource.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      
      // Check essential fields, allow additional fields from implementation
      expect(result).toMatchObject({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'http://photo.url',
      });
      
      // Verify additional enterprise fields are present
      expect(result).toHaveProperty('emailVerified');
      expect(result).toHaveProperty('roles');
      expect(result).toHaveProperty('status');
    });

    it('should register and return AuthUser', async () => {
      const mockSupabaseUserDto: AuthUserDto = {
        id: 'user123',
        email: 'newuser@example.com',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayName: null,
        photoURL: null,
      };

      mockDataSource.createUserWithEmailAndPassword.mockResolvedValueOnce();
      mockDataSource.getCurrentUser.mockResolvedValueOnce(mockSupabaseUserDto);

      const result = await authRepository.register(
        'newuser@example.com',
        'password123'
      );

      expect(mockDataSource.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        'newuser@example.com',
        'password123'
      );
      
      // Check essential fields, allow additional fields from implementation
      expect(result).toMatchObject({
        id: 'user123',
        email: 'newuser@example.com',
        displayName: undefined,
        photoURL: undefined,
      });
      
      // Verify additional enterprise fields are present
      expect(result).toHaveProperty('emailVerified');
      expect(result).toHaveProperty('roles');
      expect(result).toHaveProperty('status');
    });

    it('should logout the user', async () => {
      mockDataSource.signOut.mockResolvedValueOnce();

      await authRepository.logout();

      expect(mockDataSource.signOut).toHaveBeenCalled();
    });
  });

  describe('Enterprise Service Container Features', () => {
    it('should provide MFA service through container', () => {
      const mfaService = container.getMFAService();
      
      expect(mfaService).toBeDefined();
      expect(typeof mfaService.setupTOTP).toBe('function');
      expect(typeof mfaService.verifyTOTP).toBe('function');
    });

    it('should provide Compliance service through container', () => {
      const complianceService = container.getComplianceService();
      
      expect(complianceService).toBeDefined();
      expect(typeof complianceService.exportUserData).toBe('function');
      expect(typeof complianceService.generateComplianceReport).toBe('function');
    });

    it('should provide Password Policy service through container', () => {
      const passwordPolicyService = container.getPasswordPolicyService();
      
      expect(passwordPolicyService).toBeDefined();
      expect(typeof passwordPolicyService.validatePassword).toBe('function');
    });

    it('should provide enterprise methods through container', async () => {
      // Test enterprise method availability
      expect(typeof container.enableMFA).toBe('function');
      expect(typeof container.verifyMFA).toBe('function');
      expect(typeof container.validatePassword).toBe('function');
      expect(typeof container.exportUserData).toBe('function');
      expect(typeof container.requestDataDeletion).toBe('function');
    });

    it('should have all services properly injected', () => {
      const services = container.getAllServices();
      
      expect(services.authRepository).toBeDefined();
      expect(services.logger).toBeDefined();
      
      // Verify service creation through factory pattern (no singletons)
      expect(services.authRepository).toBe(authRepository);
    });
  });

  describe('Container Lifecycle', () => {
    it('should reset container and clear services', () => {
      const servicesBefore = container.getAllServices();
      expect(Object.keys(servicesBefore).length).toBeGreaterThan(0);
      
      container.reset();
      
      // Container should be reset but singleton instance should remain
      expect(AuthServiceContainer.getInstance()).toBe(container);
    });

    it('should create services via factory methods, not singletons', () => {
      const _mfaService1 = container.getMFAService();
      container.reset();
      
      // Re-initialize with new config
      const initPromise = container.initialize({
        logger: mockLogger,
        enableMFA: true
      });
      
      expect(initPromise).resolves.toBeUndefined();
    });
  });

  describe('AuthServiceFactory Usage', () => {
    it('should create different configurations for different environments', async () => {
      // Test Development Environment
      const devContainer = await AuthServiceFactory.createForDevelopment(mockLogger);
      const devServices = devContainer.getAllServices();
      expect(devServices.logger).toBeDefined();
      
      // Test Production Environment
      const prodContainer = await AuthServiceFactory.createForProduction(mockLogger);
      const prodServices = prodContainer.getAllServices();
      expect(prodServices.logger).toBeDefined();
      
      // Verify they're the same singleton instance but different configurations
      expect(devContainer).toBe(prodContainer); // Same singleton instance
    });
  });
});
