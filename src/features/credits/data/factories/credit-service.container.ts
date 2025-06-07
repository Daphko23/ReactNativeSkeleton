/**
 * @fileoverview DATA-CONTAINER-001: Enterprise Credit Service Container
 * @description Container für alle Credit Services mit Factory-basierter Dependency Injection.
 * Implementiert Singleton Pattern für Service Management und konsistente Factory-Nutzung.
 * 
 * @businessRule BR-600: Centralized service container für credit management
 * @businessRule BR-601: Factory-based service creation für alle credit services
 * @businessRule BR-602: Singleton pattern für service lifecycle management
 * @businessRule BR-603: Lazy loading und optimal resource management
 * 
 * @architecture Service container pattern mit factory delegation
 * @architecture Dependency injection container für Clean Architecture
 * @architecture Centralized service lifecycle management
 * 
 * @performance Lazy loading für optimal startup performance
 * @performance Service caching für reduced instantiation overhead
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CreditServiceContainer
 * @namespace Credits.Data.Factories
 */

// Core imports
import type { ILoggerService } from '../../../../core/logging/logger.service.interface';
import { Environment } from '../../../../core/config/environment.config.interface';

// Data Layer imports
import { SupabaseCreditDataSource } from '../datasources/supabase-credit.datasource';
import { CreditRepositoryImpl } from '../repositories/credit.repository.impl';
import { ProductRepositoryImpl } from '../repositories/product.repository.impl';

// Application Layer imports
import { CreditOrchestratorServiceImpl } from '../../application/services/credit-orchestrator.service.impl';
import { GetCreditBalanceUseCase } from '../../application/use-cases/get-credit-balance.use-case';
import { AddCreditsUseCase } from '../../application/use-cases/add-credits.use-case';
import { ValidateSufficientCreditsUseCase } from '../../application/use-cases/validate-sufficient-credits.use-case';
import { GetDailyBonusStatusUseCase } from '../../application/use-cases/get-daily-bonus-status.use-case';
import { ClaimDailyBonusUseCase } from '../../application/use-cases/claim-daily-bonus.use-case';
import { ProcessPurchaseUseCase } from '../../application/use-cases/process-purchase.use-case';
import { GetCreditAnalyticsUseCase } from '../../application/use-cases/get-credit-analytics.use-case';
import { GetUserTransactionsUseCase } from '../../application/use-cases/get-user-transactions.use-case';

// Domain Layer imports
import type { ICreditRepository } from '../../domain/interfaces/credit.repository.interface';
import type { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import type { ICreditOrchestratorService } from '../../application/interfaces/credit-orchestrator.service.interface';

/**
 * @interface CreditServiceContainerConfig
 * @description Configuration für den credit service container
 */
export interface CreditServiceContainerConfig {
  /** Logger service instance */
  logger: ILoggerService;
  
  /** Supabase client instance */
  supabaseClient: any; // SupabaseClient
  
  /** Enable analytics services */
  enableAnalytics?: boolean;
  
  /** Enable in-app purchases */
  enablePurchases?: boolean;
  
  /** Environment configuration */
  environment?: Environment;
}

/**
 * @interface CreditServices
 * @description Container für alle Credit Services
 */
export interface CreditServices {
  /** Credit repository */
  creditRepository: ICreditRepository;
  
  /** Product repository */
  productRepository: IProductRepository;
  
  /** Credit orchestrator service */
  creditOrchestratorService: ICreditOrchestratorService;
  
  /** Get credit balance use case */
  getCreditBalanceUseCase: GetCreditBalanceUseCase;
  
  /** Add credits use case */
  addCreditsUseCase: AddCreditsUseCase;
  
  /** Validate sufficient credits use case */
  validateSufficientCreditsUseCase: ValidateSufficientCreditsUseCase;
  
  /** Get daily bonus status use case */
  getDailyBonusStatusUseCase: GetDailyBonusStatusUseCase;
  
  /** Claim daily bonus use case */
  claimDailyBonusUseCase: ClaimDailyBonusUseCase;
  
  /** Process purchase use case */
  processPurchaseUseCase?: ProcessPurchaseUseCase;
  
  /** Get analytics use case */
  getCreditAnalyticsUseCase?: GetCreditAnalyticsUseCase;
  
  /** Get transactions use case */
  getUserTransactionsUseCase?: GetUserTransactionsUseCase;
  
  /** Data source */
  dataSource: SupabaseCreditDataSource;
  
  /** Logger service */
  logger: ILoggerService;
}

/**
 * @class CreditServiceContainer
 * @description Enterprise Credit Service Container für Clean Architecture
 * 
 * Centralized container für alle Credit Services mit:
 * - Factory-basierte Service-Erstellung
 * - Dependency Injection Management
 * - Lazy Loading für Performance
 * - Singleton Pattern für Service Lifecycle
 * - Konsistente Configuration Management
 * 
 * @example Enterprise Service Container Usage
 * ```typescript
 * // Container initialisieren
 * const container = CreditServiceContainer.getInstance();
 * 
 * // Services konfigurieren
 * await container.initialize({
 *   logger: enterpriseLogger,
 *   supabaseClient: supabase,
 *   enableAnalytics: true,
 *   enablePurchases: true
 * });
 * 
 * // Services abrufen
 * const creditRepository = container.getCreditRepository();
 * const orchestrator = container.getCreditOrchestratorService();
 * const balanceUseCase = container.getCreditBalanceUseCase();
 * ```
 */
export class CreditServiceContainer {
  /**
   * @static
   * @private
   * @description Singleton instance
   */
  private static instance: CreditServiceContainer | null = null;

  /**
   * @private
   * @description Container configuration
   */
  private config: CreditServiceContainerConfig | null = null;

  /**
   * @private
   * @description Service instances cache
   */
  private services: Partial<CreditServices> = {};

  /**
   * @private
   * @description Initialization flag
   */
  private initialized = false;

  /**
   * @private
   * @description Private constructor für Singleton Pattern
   */
  private constructor() {}

  /**
   * @static
   * @method getInstance
   * @description Get singleton instance
   * 
   * @returns {CreditServiceContainer} Singleton instance
   */
  public static getInstance(): CreditServiceContainer {
    if (!CreditServiceContainer.instance) {
      CreditServiceContainer.instance = new CreditServiceContainer();
    }
    
    return CreditServiceContainer.instance;
  }

  /**
   * @method initialize
   * @description Initialize container mit configuration
   * 
   * @param {CreditServiceContainerConfig} config - Container configuration
   * @returns {Promise<void>}
   */
  public async initialize(config: CreditServiceContainerConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.config = config;
    await this.initializeCoreServices();
    this.initialized = true;

    config.logger.info('CreditServiceContainer initialized successfully');
  }

  /**
   * @method getCreditRepository
   * @description Get credit repository instance
   * 
   * @returns {ICreditRepository} Credit repository
   */
  public getCreditRepository(): ICreditRepository {
    this.ensureInitialized();
    
    if (!this.services.creditRepository) {
      this.services.creditRepository = this.createCreditRepository();
    }
    
    return this.services.creditRepository;
  }

  /**
   * @method getProductRepository
   * @description Get product repository instance
   * 
   * @returns {IProductRepository} Product repository
   */
  public getProductRepository(): IProductRepository {
    this.ensureInitialized();
    
    if (!this.services.productRepository) {
      this.services.productRepository = this.createProductRepository();
    }
    
    return this.services.productRepository;
  }

  /**
   * @method getCreditOrchestratorService
   * @description Get credit orchestrator service instance
   * 
   * @returns {ICreditOrchestratorService} Credit orchestrator service
   */
  public getCreditOrchestratorService(): ICreditOrchestratorService {
    this.ensureInitialized();
    
    if (!this.services.creditOrchestratorService) {
      this.services.creditOrchestratorService = this.createCreditOrchestratorService();
    }
    
    return this.services.creditOrchestratorService;
  }

  /**
   * @method getCreditBalanceUseCase
   * @description Get credit balance use case instance
   * 
   * @returns {GetCreditBalanceUseCase} Credit balance use case
   */
  public getCreditBalanceUseCase(): GetCreditBalanceUseCase {
    this.ensureInitialized();
    
    if (!this.services.getCreditBalanceUseCase) {
      this.services.getCreditBalanceUseCase = this.createGetCreditBalanceUseCase();
    }
    
    return this.services.getCreditBalanceUseCase;
  }

  /**
   * @method getAddCreditsUseCase
   * @description Get add credits use case instance
   * 
   * @returns {AddCreditsUseCase} Add credits use case
   */
  public getAddCreditsUseCase(): AddCreditsUseCase {
    this.ensureInitialized();
    
    if (!this.services.addCreditsUseCase) {
      this.services.addCreditsUseCase = this.createAddCreditsUseCase();
    }
    
    return this.services.addCreditsUseCase;
  }

  /**
   * @method getValidateSufficientCreditsUseCase
   * @description Get validate sufficient credits use case instance
   * 
   * @returns {ValidateSufficientCreditsUseCase} Validate sufficient credits use case
   */
  public getValidateSufficientCreditsUseCase(): ValidateSufficientCreditsUseCase {
    this.ensureInitialized();
    
    if (!this.services.validateSufficientCreditsUseCase) {
      this.services.validateSufficientCreditsUseCase = this.createValidateSufficientCreditsUseCase();
    }
    
    return this.services.validateSufficientCreditsUseCase;
  }

  /**
   * @method getDailyBonusStatusUseCase
   * @description Get daily bonus status use case instance
   * 
   * @returns {GetDailyBonusStatusUseCase} Daily bonus status use case
   */
  public getDailyBonusStatusUseCase(): GetDailyBonusStatusUseCase {
    this.ensureInitialized();
    
    if (!this.services.getDailyBonusStatusUseCase) {
      this.services.getDailyBonusStatusUseCase = this.createGetDailyBonusStatusUseCase();
    }
    
    return this.services.getDailyBonusStatusUseCase;
  }

  /**
   * @method getClaimDailyBonusUseCase
   * @description Get claim daily bonus use case instance
   * 
   * @returns {ClaimDailyBonusUseCase} Claim daily bonus use case
   */
  public getClaimDailyBonusUseCase(): ClaimDailyBonusUseCase {
    this.ensureInitialized();
    
    if (!this.services.claimDailyBonusUseCase) {
      this.services.claimDailyBonusUseCase = this.createClaimDailyBonusUseCase();
    }
    
    return this.services.claimDailyBonusUseCase;
  }

  /**
   * @method getProcessPurchaseUseCase
   * @description Get process purchase use case instance
   * 
   * @returns {ProcessPurchaseUseCase} Process purchase use case
   */
  public getProcessPurchaseUseCase(): ProcessPurchaseUseCase {
    this.ensureInitialized();
    
    if (!this.services.processPurchaseUseCase && this.config?.enablePurchases) {
      this.services.processPurchaseUseCase = this.createProcessPurchaseUseCase();
    }
    
    if (!this.services.processPurchaseUseCase) {
      throw new Error('Purchase use case ist nicht verfügbar. Aktivieren Sie enablePurchases in der Konfiguration.');
    }
    
    return this.services.processPurchaseUseCase;
  }

  /**
   * @method getCreditAnalyticsUseCase
   * @description Get credit analytics use case instance
   * 
   * @returns {GetCreditAnalyticsUseCase} Credit analytics use case
   */
  public getCreditAnalyticsUseCase(): GetCreditAnalyticsUseCase {
    this.ensureInitialized();
    
    if (!this.services.getCreditAnalyticsUseCase && this.config?.enableAnalytics) {
      this.services.getCreditAnalyticsUseCase = this.createGetCreditAnalyticsUseCase();
    }
    
    if (!this.services.getCreditAnalyticsUseCase) {
      throw new Error('Analytics use case ist nicht verfügbar. Aktivieren Sie enableAnalytics in der Konfiguration.');
    }
    
    return this.services.getCreditAnalyticsUseCase;
  }

  /**
   * @method getUserTransactionsUseCase
   * @description Get user transactions use case instance
   * 
   * @returns {GetUserTransactionsUseCase} User transactions use case
   */
  public getUserTransactionsUseCase(): GetUserTransactionsUseCase {
    this.ensureInitialized();
    
    if (!this.services.getUserTransactionsUseCase) {
      this.services.getUserTransactionsUseCase = this.createGetUserTransactionsUseCase();
    }
    
    return this.services.getUserTransactionsUseCase;
  }

  /**
   * @method getAllServices
   * @description Get all initialized services
   * 
   * @returns {Partial<CreditServices>} All services
   */
  public getAllServices(): Partial<CreditServices> {
    this.ensureInitialized();
    return { ...this.services };
  }

  /**
   * @method reset
   * @description Reset container state
   */
  public reset(): void {
    this.services = {};
    this.config = null;
    this.initialized = false;
  }

  /**
   * @method isInitialized
   * @description Check if container is initialized
   * 
   * @returns {boolean} Initialization status
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * @private
   * @method initializeCoreServices
   * @description Initialize core services
   */
  private async initializeCoreServices(): Promise<void> {
    if (!this.config) {
      throw new Error('Container configuration ist nicht verfügbar');
    }

    // Initialize data source
    this.services.dataSource = new SupabaseCreditDataSource(this.config.supabaseClient);
    this.services.logger = this.config.logger;

    this.config.logger.info('Core credit services initialized');
  }

  /**
   * @private
   * @method createCreditRepository
   * @description Create credit repository instance
   */
  private createCreditRepository(): ICreditRepository {
    if (!this.services.dataSource) {
      throw new Error('Data source ist nicht initialisiert');
    }

    return new CreditRepositoryImpl(this.services.dataSource);
  }

  /**
   * @private
   * @method createProductRepository
   * @description Create product repository instance
   */
  private createProductRepository(): IProductRepository {
    if (!this.services.dataSource) {
      throw new Error('Data source ist nicht initialisiert');
    }

    return new ProductRepositoryImpl(this.services.dataSource);
  }

  /**
   * @private
   * @method createCreditOrchestratorService
   * @description Create credit orchestrator service instance
   */
  private createCreditOrchestratorService(): ICreditOrchestratorService {
    const creditRepository = this.getCreditRepository();
    const productRepository = this.getProductRepository();

    return new CreditOrchestratorServiceImpl(
      creditRepository,
      productRepository
    );
  }

  /**
   * @private
   * @method createGetCreditBalanceUseCase
   * @description Create get credit balance use case instance
   */
  private createGetCreditBalanceUseCase(): GetCreditBalanceUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new GetCreditBalanceUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createAddCreditsUseCase
   * @description Create add credits use case instance
   */
  private createAddCreditsUseCase(): AddCreditsUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new AddCreditsUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createValidateSufficientCreditsUseCase
   * @description Create validate sufficient credits use case instance
   */
  private createValidateSufficientCreditsUseCase(): ValidateSufficientCreditsUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new ValidateSufficientCreditsUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createGetDailyBonusStatusUseCase
   * @description Create get daily bonus status use case instance
   */
  private createGetDailyBonusStatusUseCase(): GetDailyBonusStatusUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new GetDailyBonusStatusUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createClaimDailyBonusUseCase
   * @description Create claim daily bonus use case instance
   */
  private createClaimDailyBonusUseCase(): ClaimDailyBonusUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new ClaimDailyBonusUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createProcessPurchaseUseCase
   * @description Create process purchase use case instance
   */
  private createProcessPurchaseUseCase(): ProcessPurchaseUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new ProcessPurchaseUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createGetCreditAnalyticsUseCase
   * @description Create get credit analytics use case instance
   */
  private createGetCreditAnalyticsUseCase(): GetCreditAnalyticsUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new GetCreditAnalyticsUseCase(orchestratorService);
  }

  /**
   * @private
   * @method createGetUserTransactionsUseCase
   * @description Create get user transactions use case instance
   */
  private createGetUserTransactionsUseCase(): GetUserTransactionsUseCase {
    const orchestratorService = this.getCreditOrchestratorService();
    return new GetUserTransactionsUseCase(orchestratorService);
  }

  /**
   * @private
   * @method ensureInitialized
   * @description Ensure container ist initialized
   * 
   * @throws {Error} When not initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('CreditServiceContainer ist nicht initialisiert. Rufen Sie initialize() auf.');
    }
  }

  /**
   * @static
   * @method resetInstance
   * @description Reset singleton instance
   */
  public static resetInstance(): void {
    if (CreditServiceContainer.instance) {
      CreditServiceContainer.instance.reset();
      CreditServiceContainer.instance = null;
    }
  }
} 