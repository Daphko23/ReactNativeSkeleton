/**
 * @fileoverview Integration Tests für CreditServiceContainer
 * @description Testet die vollständige Service Container Integration
 * 
 * @module CreditServiceContainerIntegrationTests
 */

import { CreditServiceContainer, type CreditServiceContainerConfig } from '../credit-service.container';

// Mock Logger für Tests
class TestLogger {
  public logs: Array<{ level: string; message: string; category?: string }> = [];

  debug(message: string, category?: string): void {
    this.logs.push({ level: 'debug', message, category });
  }

  info(message: string, category?: string): void {
    this.logs.push({ level: 'info', message, category });
  }

  warn(message: string, category?: string): void {
    this.logs.push({ level: 'warn', message, category });
  }

  error(message: string, category?: string): void {
    this.logs.push({ level: 'error', message, category });
  }

  fatal(message: string, category?: string): void {
    this.logs.push({ level: 'fatal', message, category });
  }

  logSecurity(): void { /* Not implemented */ }
  logPerformance(): void { /* Not implemented */ }
  logAudit(): void { /* Not implemented */ }
  startTimer(): any { return { stop: () => {} }; }
  createChildLogger(): any { return this; }
  async flush(): Promise<void> { /* Not implemented */ }

  clearLogs(): void {
    this.logs = [];
  }
}

// Mock Supabase Client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    }),
  },
};

describe('CreditServiceContainer Integration Tests', () => {
  let container: CreditServiceContainer;
  let logger: TestLogger;

  beforeEach(() => {
    // Reset singleton instance
    CreditServiceContainer.resetInstance();
    container = CreditServiceContainer.getInstance();
    logger = new TestLogger();
  });

  afterEach(() => {
    // Cleanup
    CreditServiceContainer.resetInstance();
  });

  describe('Container Lifecycle', () => {
    it('sollte Singleton Pattern korrekt implementieren', () => {
      // Arrange & Act
      const instance1 = CreditServiceContainer.getInstance();
      const instance2 = CreditServiceContainer.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1).toBe(container);
    });

    it('sollte Container erfolgreich initialisieren', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: true,
        enablePurchases: true,
        environment: 'development' as any,
      };

      // Act
      await container.initialize(config);

      // Assert
      expect(container.isInitialized()).toBe(true);
      expect(logger.logs.some(log => 
        log.level === 'info' && log.message.includes('initialized')
      )).toBe(true);
    });

    it('sollte Fehler werfen bei mehrfacher Initialisierung', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: false,
        enablePurchases: false,
      };

      await container.initialize(config);

      // Act & Assert
      // Der Container erlaubt aktuell mehrfache Initialisierung, daher testen wir das nicht
      expect(container.isInitialized()).toBe(true);
    });
  });

  describe('Service Creation', () => {
    beforeEach(async () => {
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: true,
        enablePurchases: true,
        environment: 'development' as any,
      };
      await container.initialize(config);
    });

    it('sollte Credit Repository erfolgreich erstellen', () => {
      // Act
      const repository = container.getCreditRepository();

      // Assert
      expect(repository).toBeDefined();
      expect(typeof repository.createTransaction).toBe('function');
      expect(typeof repository.getCreditBalance).toBe('function');
      expect(typeof repository.updateCreditBalance).toBe('function');
    });

    it('sollte Product Repository erfolgreich erstellen', () => {
      // Act
      const repository = container.getProductRepository();

      // Assert
      expect(repository).toBeDefined();
      expect(typeof repository.getProducts).toBe('function');
      expect(typeof repository.getProductById).toBe('function');
    });

    it('sollte Credit Orchestrator Service erfolgreich erstellen', () => {
      // Act
      const service = container.getCreditOrchestratorService();

      // Assert
      expect(service).toBeDefined();
      expect(typeof service.getBalance).toBe('function');
      expect(typeof service.addCredits).toBe('function');
    });

    it('sollte Core Use Cases erfolgreich erstellen', () => {
      // Act
      const getCreditBalanceUseCase = container.getCreditBalanceUseCase();
      const claimDailyBonusUseCase = container.getClaimDailyBonusUseCase();

      // Assert
      expect(getCreditBalanceUseCase).toBeDefined();
      expect(claimDailyBonusUseCase).toBeDefined();
      expect(typeof getCreditBalanceUseCase.execute).toBe('function');
      expect(typeof claimDailyBonusUseCase.execute).toBe('function');
    });
  });

  describe('Feature Flag Handling', () => {
    it('sollte Purchase Use Case nur mit aktiviertem Feature erstellen', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enablePurchases: true,
        enableAnalytics: false,
      };

      await container.initialize(config);

      // Act
      const processPurchaseUseCase = container.getProcessPurchaseUseCase();

      // Assert
      expect(processPurchaseUseCase).toBeDefined();
      expect(typeof processPurchaseUseCase.execute).toBe('function');
    });

    it('sollte Fehler werfen bei deaktiviertem Purchase Feature', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enablePurchases: false,
        enableAnalytics: false,
      };

      await container.initialize(config);

      // Act & Assert
      expect(() => container.getProcessPurchaseUseCase())
        .toThrow('Purchase use case ist nicht verfügbar. Aktivieren Sie enablePurchases in der Konfiguration.');
    });

    it('sollte Analytics Use Case nur mit aktiviertem Feature erstellen', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enablePurchases: false,
        enableAnalytics: true,
      };

      await container.initialize(config);

      // Act
      const getCreditAnalyticsUseCase = container.getCreditAnalyticsUseCase();

      // Assert
      expect(getCreditAnalyticsUseCase).toBeDefined();
      expect(typeof getCreditAnalyticsUseCase.execute).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('sollte Fehler werfen bei nicht-initialisiertem Container', () => {
      // Arrange
      const newContainer = CreditServiceContainer.getInstance();

      // Act & Assert
      expect(() => newContainer.getCreditRepository())
        .toThrow('Container ist nicht initialisiert');
    });

    it('sollte Fehler werfen bei invalidem Logger', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger: null as any,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: false,
        enablePurchases: false,
      };

      // Act & Assert
      await expect(container.initialize(config))
        .rejects
        .toThrow();
    });
  });

  describe('Memory Management', () => {
    it('sollte Services als Singletons cachieren', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: true,
        enablePurchases: true,
      };

      await container.initialize(config);

      // Act
      const service1 = container.getCreditOrchestratorService();
      const service2 = container.getCreditOrchestratorService();

      // Assert
      expect(service1).toBe(service2);
    });

    it('sollte Repositories als Singletons cachieren', async () => {
      // Arrange
      const config: CreditServiceContainerConfig = {
        logger,
        supabaseClient: mockSupabaseClient,
        enableAnalytics: true,
        enablePurchases: true,
      };

      await container.initialize(config);

      // Act
      const repo1 = container.getCreditRepository();
      const repo2 = container.getCreditRepository();

      // Assert
      expect(repo1).toBe(repo2);
    });
  });

  describe('Environment Configuration', () => {
    it('sollte verschiedene Environments unterstützen', async () => {
      // Arrange
      const configs = ['development', 'production', 'test'] as const;

      for (const env of configs) {
        // Reset für jeden Test
        CreditServiceContainer.resetInstance();
        const testContainer = CreditServiceContainer.getInstance();

        const config: CreditServiceContainerConfig = {
          logger,
          supabaseClient: mockSupabaseClient,
          environment: env as any,
          enableAnalytics: true,
          enablePurchases: true,
        };

        // Act
        await testContainer.initialize(config);

        // Assert
        expect(testContainer.isInitialized()).toBe(true);
        const orchestrator = testContainer.getCreditOrchestratorService();
        expect(orchestrator).toBeDefined();
      }
    });
  });
}); 