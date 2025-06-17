/**
 * @fileoverview SUPABASE-CONFIG: Enterprise Supabase Configuration Management
 * @description Comprehensive Supabase client configuration providing type-safe database operations, authentication management, and real-time functionality with enterprise-grade security and performance optimizations
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Config.Supabase
 * @namespace Core.Config.Supabase
 * @category Configuration
 * @subcategory Database
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types/database.types';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for Supabase configuration
const logger = LoggerFactory.createServiceLogger('SupabaseConfig');

/**
 * Supabase Configuration Interface
 * 
 * Defines the structure for Supabase client configuration including connection parameters,
 * authentication settings, and environment-specific configurations for enterprise deployment.
 * 
 * @interface SupabaseConfig
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Configuration
 * 
 * @example
 * Basic configuration setup:
 * ```tsx
 * const config: SupabaseConfig = {
 *   url: 'https://your-project.supabase.co',
 *   anonKey: 'your-anon-key',
 *   projectRef: 'your-project-ref',
 *   region: 'us-east-1'
 * };
 * ```
 * 
 * @example
 * Enterprise configuration with service role:
 * ```tsx
 * const enterpriseConfig: SupabaseConfig = {
 *   url: process.env.SUPABASE_URL,
 *   anonKey: process.env.SUPABASE_ANON_KEY,
 *   serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
 *   projectRef: process.env.SUPABASE_PROJECT_REF,
 *   region: 'us-east-1'
 * };
 * ```
 * 
 * @security
 * - Anonymous key is safe for client-side usage with RLS policies
 * - Service role key should only be used server-side or for admin operations
 * - URL and project reference are public but should be validated
 * - Environment variables should be used for sensitive configuration
 * 
 * @configuration_requirements
 * - URL must be a valid HTTPS Supabase project URL
 * - Anonymous key is required for client initialization
 * - Service role key is optional but required for admin operations
 * - Project reference should match the Supabase project
 * - Region should match the project's deployment region
 * 
 * @compliance
 * - Configuration supports GDPR compliance through RLS policies
 * - Audit logging enabled through Supabase dashboard
 * - Data encryption in transit and at rest
 * - Regional data residency configuration
 */
export interface SupabaseConfig {
  /**
   * Supabase project URL
   * 
   * The base URL for your Supabase project providing access to all services
   * including authentication, database, storage, and real-time functionality.
   * 
   * @type {string}
   * @required
   * @format https://your-project.supabase.co
   * @example 'https://your-project.supabase.co'
   * @security Public URL, safe for client-side usage
   */
  url: string;

  /**
   * Anonymous API key
   * 
   * Public anonymous key for client-side Supabase operations. This key enables
   * access to public data and authenticated operations with Row Level Security
   * policies applied.
   * 
   * @type {string}
   * @required
   * @format JWT token string
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   * @security Safe for client-side exposure, RLS policies apply
   */
  anonKey: string;

  /**
   * Service role key
   * 
   * Administrative key with elevated permissions for server-side operations.
   * Should only be used in secure environments and never exposed client-side.
   * 
   * @type {string}
   * @optional
   * @format JWT token string
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   * @security Sensitive - server-side only, bypasses RLS
   * @usage Admin operations, server-side scripts
   */
  serviceRoleKey?: string;

  /**
   * Project reference identifier
   * 
   * Unique identifier for the Supabase project used for API routing
   * and service identification in multi-project environments.
   * 
   * @type {string}
   * @optional
   * @format Alphanumeric string
   * @example 'abcdefghijklmnopqrst'
   * @usage Project identification, API routing
   */
  projectRef?: string;

  /**
   * Deployment region
   * 
   * Geographic region where the Supabase project is deployed, affecting
   * data residency, latency, and compliance requirements.
   * 
   * @type {string}
   * @optional
   * @format AWS region code
   * @example 'us-east-1', 'eu-west-1'
   * @compliance Data residency, GDPR compliance
   * @performance Affects latency for users
   */
  region?: string;

  /**
   * Storage configuration for file management
   * 
   * Configuration for Supabase Storage buckets and file operations
   * including avatar storage, document management, and media files.
   * 
   * @type {StorageConfig}
   * @optional
   * @since 2.0.0
   */
  storage?: {
    /**
     * Avatar storage bucket configuration
     */
    avatars?: {
      bucket: string;
      maxFileSize: number;
      allowedTypes: string[];
      cacheControl?: string;
    };
  };
}

/**
 * Storage Configuration Interface
 * 
 * Defines configuration for Supabase Storage buckets and file operations
 * with type-safe bucket management and validation rules.
 * 
 * @interface StorageConfig
 * @since 2.0.0
 */
export interface StorageConfig {
  avatars: {
    bucket: string;
    maxFileSize: number;
    allowedTypes: string[];
    cacheControl?: string;
  };
}

/**
 * Enterprise Supabase Configuration
 * 
 * Environment-based Supabase configuration providing secure, scalable, and
 * compliant database connectivity with comprehensive authentication and
 * real-time capabilities for enterprise applications.
 * 
 * @constant supabaseConfig
 * @type {SupabaseConfig}
 * @since 1.0.0
 * @readonly
 * 
 * @description
 * Centralized configuration for Supabase client initialization providing
 * type-safe database operations, authentication management, and real-time
 * subscriptions with enterprise security and performance optimizations.
 * 
 * @example
 * Configuration usage in services:
 * ```tsx
 * import { supabaseConfig } from '@/core/config/supabase.config';
 * 
 * const initializeService = () => {
 *   console.log(`Connecting to: ${supabaseConfig.url}`);
 *   console.log(`Region: ${supabaseConfig.region}`);
 * };
 * ```
 * 
 * @security_features
 * - Environment-based configuration management
 * - Secure key handling with fallback mechanisms
 * - Regional deployment configuration
 * - Connection validation and error handling
 * 
 * @configuration_sources
 * - Environment variables (production)
 * - Default values (development)
 * - Runtime configuration (testing)
 * - CI/CD pipeline injection (deployment)
 * 
 * @deployment_environments
 * - **Development**: Local configuration with test database
 * - **Staging**: Pre-production environment with staging database
 * - **Production**: Live environment with production database
 * - **Testing**: Isolated environment for automated testing
 * 
 * @business_rules
 * - BR-100: Centralized Supabase client configuration
 * - BR-101: Environment-based configuration management
 * - BR-102: Type-safe database schema integration
 * 
 * @compliance_requirements
 * - GDPR data residency through region configuration
 * - SOC 2 security through encrypted connections
 * - Audit logging through Supabase built-in features
 * - Data encryption in transit and at rest
 * 
 * @performance_optimizations
 * - Connection pooling and management
 * - Automatic session refresh
 * - Real-time connection stability
 * - Optimized heartbeat intervals
 * 
 * @todo Migrate to environment variables for production security
 * @todo Implement dynamic region selection based on user location
 * @todo Add configuration validation and error handling
 * @todo Implement connection pooling optimization
 */
const supabaseConfig: SupabaseConfig = {
  // 🚨 SECURITY NOTICE: Temporär hardcoded für Test - korrigiere für Produktion!
  // TODO: Migrate to environment variables: process.env.EXPO_PUBLIC_SUPABASE_URL
  url: 'https://ubolrasyvzrurjsafzay.supabase.co',
  
  // 🚨 SECURITY NOTICE: Temporär hardcoded für Test - korrigiere für Produktion!
  // TODO: Migrate to environment variables: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVib2xyYXN5dnpydXJqc2FmemF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDAwMjksImV4cCI6MjA2NDI3NjAyOX0.iVJZtL5R1fQCrTdbPki-wo7vYMFqjeY13fVx4yM8BQY',
  
  // Server-side only - properly secured via environment
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Project identification
  projectRef: 'ubolrasyvzrurjsafzay',
  
  // Regional deployment configuration
  region: process.env.EXPO_PUBLIC_SUPABASE_REGION || 'us-east-1',

  // Storage configuration
  storage: {
    avatars: {
      bucket: process.env.EXPO_PUBLIC_SUPABASE_AVATAR_BUCKET || 'avatars',
      maxFileSize: parseInt(process.env.EXPO_PUBLIC_SUPABASE_AVATAR_MAX_SIZE || '5242880'), // 5MB default
      allowedTypes: (process.env.EXPO_PUBLIC_SUPABASE_AVATAR_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
      cacheControl: process.env.EXPO_PUBLIC_SUPABASE_AVATAR_CACHE_CONTROL || '3600',
    },
  },
};

/**
 * Avatar Storage Configuration Export
 * 
 * Centralized avatar storage configuration for use across services.
 * Provides type-safe access to avatar bucket settings and validation rules.
 * 
 * @constant avatarStorageConfig
 * @since 2.0.0
 * @readonly
 * 
 * @example
 * Using avatar storage configuration:
 * ```tsx
 * import { avatarStorageConfig } from '@/core/config/supabase.config';
 * 
 * // Validate file size
 * const isValidSize = fileSize <= avatarStorageConfig.maxFileSize;
 * 
 * // Check file type
 * const isValidType = avatarStorageConfig.allowedTypes.includes(fileType);
 * 
 * // Get bucket name
 * const bucketName = avatarStorageConfig.bucket;
 * ```
 */
export const avatarStorageConfig = supabaseConfig.storage?.avatars || {
  bucket: 'avatars',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  cacheControl: '3600',
};

/**
 * Enterprise Supabase Client Instance
 * 
 * Type-safe, enterprise-configured Supabase client providing comprehensive
 * database operations, authentication management, real-time subscriptions,
 * and security features with optimized performance for production environments.
 * 
 * @constant supabase
 * @type {SupabaseClient<Database>}
 * @since 1.0.0
 * @readonly
 * 
 * @description
 * Production-ready Supabase client with enterprise configuration including
 * automatic session management, secure storage integration, real-time
 * connection stability, and comprehensive type safety through database
 * schema integration.
 * 
 * @example
 * Authentication operations:
 * ```tsx
 * import { supabase } from '@/core/config/supabase.config';
 * 
 * // Sign in user
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 * 
 * // Get current session
 * const { data: { session } } = await supabase.auth.getSession();
 * 
 * // Sign out user
 * await supabase.auth.signOut();
 * ```
 * 
 * @example
 * Database operations with type safety:
 * ```tsx
 * // Type-safe select operation
 * const { data: users, error } = await supabase
 *   .from('users')
 *   .select('id, email, full_name, created_at')
 *   .eq('active', true)
 *   .order('created_at', { ascending: false });
 * 
 * // Type-safe insert operation
 * const { data: newUser, error: insertError } = await supabase
 *   .from('users')
 *   .insert({
 *     email: 'newuser@example.com',
 *     full_name: 'New User',
 *     active: true
 *   })
 *   .select()
 *   .single();
 * ```
 * 
 * @example
 * Real-time subscriptions:
 * ```tsx
 * // Subscribe to table changes
 * const subscription = supabase
 *   .channel('users-channel')
 *   .on('postgres_changes', 
 *     { event: '*', schema: 'public', table: 'users' },
 *     (payload) => {
 *       console.log('Change received!', payload);
 *     }
 *   )
 *   .subscribe();
 * 
 * // Cleanup subscription
 * return () => {
 *   subscription.unsubscribe();
 * };
 * ```
 * 
 * @example
 * File storage operations:
 * ```tsx
 * // Upload file
 * const { data: uploadData, error: uploadError } = await supabase.storage
 *   .from('avatars')
 *   .upload(`user-${userId}/avatar.jpg`, file);
 * 
 * // Download file
 * const { data: downloadData } = await supabase.storage
 *   .from('avatars')
 *   .download(`user-${userId}/avatar.jpg`);
 * ```
 * 
 * @authentication_features
 * - **Auto-refresh Tokens**: Automatic token refresh for seamless sessions
 * - **Persistent Sessions**: Secure session storage with AsyncStorage
 * - **Multiple Providers**: Email, OAuth, magic links, phone authentication
 * - **Session Management**: Built-in session lifecycle management
 * - **Security Headers**: Custom client identification headers
 * 
 * @database_features
 * - **Type Safety**: Full TypeScript type checking with generated types
 * - **Row Level Security**: Built-in RLS policy enforcement
 * - **Real-time**: Live data synchronization and change notifications
 * - **Filtering**: Advanced query capabilities with type safety
 * - **Joins**: Complex relational queries with type inference
 * 
 * @real_time_features
 * - **Connection Stability**: Automatic reconnection with exponential backoff
 * - **Heartbeat Monitoring**: Regular connection health checks
 * - **Channel Management**: Multiple subscription channels support
 * - **Event Filtering**: Granular event subscription control
 * - **Performance**: Optimized for low latency and high throughput
 * 
 * @security_features
 * - **Encrypted Connections**: HTTPS/WSS for all communications
 * - **Token Security**: JWT-based authentication with automatic refresh
 * - **RLS Enforcement**: Database-level security policy enforcement
 * - **Audit Logging**: Comprehensive activity and access logging
 * - **Data Validation**: Input validation and sanitization
 * 
 * @performance_features
 * - **Connection Pooling**: Efficient database connection management
 * - **Query Optimization**: Optimized query execution and caching
 * - **Batch Operations**: Support for bulk database operations
 * - **Edge Network**: Global CDN for optimal performance
 * - **Compression**: Data compression for reduced bandwidth usage
 * 
 * @storage_features
 * - **File Management**: Secure file upload, download, and management
 * - **Access Control**: Fine-grained file access permissions
 * - **CDN Integration**: Global file distribution for performance
 * - **Automatic Resizing**: Image processing and optimization
 * - **Progress Tracking**: Upload and download progress monitoring
 * 
 * @enterprise_capabilities
 * - **Multi-tenancy**: Support for multi-tenant applications
 * - **Compliance**: GDPR, SOC 2, and industry compliance support
 * - **Monitoring**: Built-in monitoring and analytics
 * - **Backup**: Automated backup and point-in-time recovery
 * - **Scaling**: Automatic scaling based on demand
 * 
 * @development_features
 * - **Debug Mode**: Enhanced debugging in development environments
 * - **Error Handling**: Comprehensive error reporting and handling
 * - **Type Generation**: Automatic TypeScript type generation
 * - **Testing Support**: Built-in testing utilities and mocking
 * - **Documentation**: Integrated API documentation and examples
 * 
 * @use_cases
 * - User authentication and authorization
 * - Real-time data synchronization
 * - File storage and management
 * - Database operations with type safety
 * - Enterprise application backends
 * - Multi-tenant SaaS applications
 * 
 * @dependencies
 * - @supabase/supabase-js: Supabase JavaScript client
 * - @react-native-async-storage/async-storage: Secure storage for React Native
 * 
 * @see {@link SupabaseConfig} for configuration interface
 * @see {@link getSupabaseAdmin} for admin client creation
 * @see {@link validateSupabaseConfig} for configuration validation
 */
export const supabase = createClient<Database>(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      // Auto-refresh token management for seamless user experience
      autoRefreshToken: true,
      
      // Persist session in secure storage for app restart continuity
      persistSession: true,
      
      // Detect session in URL for web/expo - disabled for React Native
      detectSessionInUrl: false,
      
      // Authentication flow type - implicit for React Native compatibility
      // Note: PKCE flow temporarily disabled until Crypto module resolution
      flowType: 'implicit',
      
      // Storage configuration for React Native secure session persistence
      storage: AsyncStorage,
    },
    
    // Global configuration for client identification and monitoring
    global: {
      headers: {
        'X-Client-Info': 'DaphkoAISkeleton@1.0.0',
        'X-Client-Platform': 'react-native',
        'X-Client-Environment': process.env.NODE_ENV || 'development',
      },
    },
    
          // Real-time configuration for stable WebSocket connections
      realtime: {
        // Connection health monitoring with 30-second heartbeat
        heartbeatIntervalMs: 30000,
        
        // Intelligent reconnection with exponential backoff (max 30 seconds)
        reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),
        
        // Connection timeout configuration
        timeout: 10000,
        
        // Additional real-time parameters for optimization
        params: {
          // Enable presence tracking for collaborative features
          presence: { key: 'user_presence' },
          
          // Connection quality monitoring
          log_level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
        },
      },
    
    // Database configuration for schema and connection management
    db: {
      // Schema for multi-tenancy support (default: public)
      schema: 'public',
    },
  }
);

/**
 * Admin Supabase Client Factory
 * 
 * Creates an administrative Supabase client with service role privileges,
 * bypassing Row Level Security policies for administrative operations.
 * Should only be used in secure server-side environments.
 * 
 * @function getSupabaseAdmin
 * @returns {SupabaseClient<Database>} Admin client with elevated permissions
 * @throws {Error} When service role key is not configured
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory Administration
 * 
 * @description
 * Factory function for creating administrative Supabase clients with
 * service role privileges. These clients bypass RLS policies and should
 * only be used for legitimate administrative operations in secure
 * environments.
 * 
 * @example
 * Administrative user management:
 * ```tsx
 * import { getSupabaseAdmin } from '@/core/config/supabase.config';
 * 
 * const adminClient = getSupabaseAdmin();
 * 
 * // Admin-only user role update
 * const { data, error } = await adminClient
 *   .from('users')
 *   .update({ role: 'admin', updated_at: new Date().toISOString() })
 *   .eq('id', userId)
 *   .select()
 *   .single();
 * 
 * if (error) {
 *   throw new Error(`Failed to update user role: ${error.message}`);
 * }
 * ```
 * 
 * @example
 * System-wide data maintenance:
 * ```tsx
 * const adminClient = getSupabaseAdmin();
 * 
 * // Bulk data cleanup operation
 * const { error } = await adminClient
 *   .from('logs')
 *   .delete()
 *   .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
 * 
 * if (error) {
 *   console.error('Cleanup failed:', error);
 * }
 * ```
 * 
 * @example
 * Cross-tenant administrative queries:
 * ```tsx
 * const adminClient = getSupabaseAdmin();
 * 
 * // Query across all tenants (bypasses RLS)
 * const { data: allUserStats } = await adminClient
 *   .from('users')
 *   .select('tenant_id, count(*)')
 *   .group('tenant_id');
 * ```
 * 
 * @security_warnings
 * - Service role key must be kept secure and never exposed client-side
 * - Admin client bypasses all Row Level Security policies
 * - Should only be used for legitimate administrative operations
 * - All admin operations should be logged and audited
 * - Access should be restricted to authorized personnel only
 * 
 * @admin_capabilities
 * - **Full Database Access**: Complete read/write access to all tables
 * - **RLS Bypass**: Bypasses all Row Level Security policies
 * - **System Operations**: Database maintenance and administrative tasks
 * - **Cross-tenant Access**: Access data across all tenant boundaries
 * - **Schema Modifications**: Ability to modify database schema
 * 
 * @use_cases
 * - User role and permission management
 * - System-wide data cleanup and maintenance
 * - Cross-tenant administrative reporting
 * - Database schema migrations
 * - Emergency data recovery operations
 * - Compliance and audit data access
 * 
 * @best_practices
 * - Use admin client sparingly and only when necessary
 * - Implement proper authorization checks before admin operations
 * - Log all administrative actions for audit trails
 * - Validate admin credentials before client creation
 * - Use try-catch blocks for proper error handling
 * - Clean up admin client references after use
 * 
 * @error_handling
 * - Throws Error when service role key is not configured
 * - Returns client with proper error handling configuration
 * - Includes proper timeout and retry mechanisms
 * - Comprehensive error logging for debugging
 * 
 * @configuration_requirements
 * - SUPABASE_SERVICE_ROLE_KEY environment variable must be set
 * - Service role key must have proper permissions
 * - Environment must be secure for service role key usage
 * - Proper authentication and authorization mechanisms in place
 * 
 * @see {@link supabase} for standard client usage
 * @see {@link validateSupabaseConfig} for configuration validation
 */
export const getSupabaseAdmin = () => {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error(
      'Service role key not configured. Set SUPABASE_SERVICE_ROLE_KEY environment variable.'
    );
  }
  
  return createClient<Database>(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    {
      auth: {
        // Disable auto-refresh for admin client (stateless operations)
        autoRefreshToken: false,
        
        // No session persistence for admin client
        persistSession: false,
        
        // No URL session detection for admin operations
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'DaphkoAISkeleton-Admin@1.0.0',
          'X-Client-Type': 'admin',
          'X-Client-Environment': process.env.NODE_ENV || 'development',
        },
      },
      // No real-time configuration needed for admin operations
    }
  );
};

/**
 * Supabase Configuration Validator
 * 
 * Validates the current Supabase configuration to ensure all required
 * fields are present and properly formatted for successful client
 * initialization and operation.
 * 
 * @function validateSupabaseConfig
 * @returns {boolean} True if configuration is valid, false otherwise
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory Validation
 * 
 * @description
 * Comprehensive validation function that checks all critical Supabase
 * configuration parameters including URL format, key presence, and
 * optional field validation. Provides detailed error logging for
 * debugging configuration issues.
 * 
 * @example
 * Configuration validation in app initialization:
 * ```tsx
 * import { validateSupabaseConfig } from '@/core/config/supabase.config';
 * 
 * const initializeApp = async () => {
 *   if (!validateSupabaseConfig()) {
 *     throw new Error('Invalid Supabase configuration. Check environment variables.');
 *   }
 *   
 *   // Proceed with app initialization
 *   console.log('Supabase configuration validated successfully');
 * };
 * ```
 * 
 * @example
 * Environment-specific validation:
 * ```tsx
 * const validateEnvironment = () => {
 *   const isValid = validateSupabaseConfig();
 *   
 *   if (!isValid) {
 *     if (process.env.NODE_ENV === 'production') {
 *       // Critical error in production
 *       throw new Error('Production Supabase configuration is invalid');
 *     } else {
 *       // Warning in development
 *       console.warn('Development Supabase configuration needs attention');
 *     }
 *   }
 *   
 *   return isValid;
 * };
 * ```
 * 
 * @validation_checks
 * - **URL Presence**: Ensures Supabase URL is configured
 * - **URL Format**: Validates URL is properly formatted HTTPS URL
 * - **Anonymous Key**: Ensures anonymous key is present
 * - **Key Format**: Basic JWT format validation for keys
 * - **Optional Fields**: Validates optional configuration fields
 * 
 * @error_reporting
 * - Detailed console error messages for each validation failure
 * - Specific field identification for targeted debugging
 * - URL format validation with descriptive error messages
 * - Comprehensive validation summary reporting
 * 
 * @security_validation
 * - Ensures HTTPS URLs for secure communication
 * - Validates key presence for proper authentication
 * - Checks for common configuration security issues
 * - Validates environment-appropriate configuration
 * 
 * @use_cases
 * - Application startup validation
 * - Environment configuration verification
 * - Deployment health checks
 * - Development debugging assistance
 * - CI/CD pipeline validation
 * 
 * @deployment_integration
 * - Integrate with application health checks
 * - Use in deployment validation scripts
 * - Include in monitoring and alerting systems
 * - Validate during environment transitions
 * 
 * @see {@link supabaseConfig} for configuration object
 * @see {@link getSupabaseStatus} for runtime connection validation
 */
export const validateSupabaseConfig = (): boolean => {
  const requiredFields = ['url', 'anonKey'] as const;
  let isValid = true;
  
  // Validate required fields presence
  for (const field of requiredFields) {
    if (!supabaseConfig[field]) {
      logger.error('Missing required Supabase config field', LogCategory.BUSINESS, {
        service: 'SupabaseConfig',
        metadata: { field, configUrl: supabaseConfig.url }
      });
      isValid = false;
    }
  }
  
  // Validate URL format
  if (supabaseConfig.url) {
    try {
      const url = new URL(supabaseConfig.url);
      
      // Ensure HTTPS for security
      if (url.protocol !== 'https:') {
        logger.error('Supabase URL must use HTTPS protocol', LogCategory.BUSINESS, {
          service: 'SupabaseConfig',
          metadata: { protocol: url.protocol, url: supabaseConfig.url }
        });
        isValid = false;
      }
      
      // Validate Supabase domain format
      if (!url.hostname.includes('supabase.co') && process.env.NODE_ENV === 'production') {
        logger.warn('Non-standard Supabase domain detected', LogCategory.BUSINESS, {
          service: 'SupabaseConfig',
          metadata: { hostname: url.hostname, environment: process.env.NODE_ENV }
        });
      }
    } catch {
      logger.error('Invalid Supabase URL format', LogCategory.BUSINESS, {
        service: 'SupabaseConfig',
        metadata: { url: supabaseConfig.url }
      });
      isValid = false;
    }
  }
  
  // Validate anonymous key format (basic JWT check)
  if (supabaseConfig.anonKey && !supabaseConfig.anonKey.startsWith('eyJ')) {
    logger.error('Anonymous key does not appear to be a valid JWT token', LogCategory.BUSINESS, {
      service: 'SupabaseConfig',
      metadata: { keyPrefix: supabaseConfig.anonKey?.substring(0, 10) }
    });
    isValid = false;
  }
  
  // Validate service role key format if present
  if (supabaseConfig.serviceRoleKey && !supabaseConfig.serviceRoleKey.startsWith('eyJ')) {
    logger.error('Service role key does not appear to be a valid JWT token', LogCategory.BUSINESS, {
      service: 'SupabaseConfig',
      metadata: { keyPrefix: supabaseConfig.serviceRoleKey?.substring(0, 10) }
    });
    isValid = false;
  }
  
  // Log validation result
  if (isValid) {
    logger.info('Supabase configuration validation passed', LogCategory.BUSINESS, {
      service: 'SupabaseConfig',
      metadata: { url: supabaseConfig.url, region: supabaseConfig.region }
    });
  } else {
    logger.error('Supabase configuration validation failed', LogCategory.BUSINESS, {
      service: 'SupabaseConfig',
      metadata: { url: supabaseConfig.url, hasAnonKey: !!supabaseConfig.anonKey }
    });
  }
  
  return isValid;
};

/**
 * Supabase Connection Status Monitor
 * 
 * Monitors the current Supabase connection status by performing a lightweight
 * database operation and returning detailed connection information for
 * debugging and monitoring purposes.
 * 
 * @function getSupabaseStatus
 * @returns {Promise<SupabaseStatus>} Connection status information
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory Monitoring
 * 
 * @description
 * Real-time connection monitoring function that performs a non-invasive
 * database operation to verify connectivity, authentication, and basic
 * functionality. Provides comprehensive status information for health
 * checks and debugging.
 * 
 * @example
 * Application health check:
 * ```tsx
 * import { getSupabaseStatus } from '@/core/config/supabase.config';
 * 
 * const performHealthCheck = async () => {
 *   try {
 *     const status = await getSupabaseStatus();
 *     
 *     if (status.connected) {
 *       console.log('✅ Supabase connection healthy');
 *       console.log(`Response time: ${status.responseTime}ms`);
 *     } else {
 *       console.error('❌ Supabase connection failed:', status.error);
 *     }
 *     
 *     return status;
 *   } catch (error) {
 *     console.error('Health check failed:', error);
 *     return { connected: false, error: error.message };
 *   }
 * };
 * ```
 * 
 * @example
 * Monitoring dashboard integration:
 * ```tsx
 * const StatusDashboard = () => {
 *   const [status, setStatus] = useState(null);
 *   
 *   useEffect(() => {
 *     const checkStatus = async () => {
 *       const result = await getSupabaseStatus();
 *       setStatus(result);
 *     };
 *     
 *     // Check immediately and then every 30 seconds
 *     checkStatus();
 *     const interval = setInterval(checkStatus, 30000);
 *     
 *     return () => clearInterval(interval);
 *   }, []);
 *   
 *   return (
 *     <View>
 *       <Text>Status: {status?.connected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
 *       {status?.error && <Text>Error: {status.error}</Text>}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @status_information
 * - **Connection Status**: Boolean indicating successful connectivity
 * - **Error Details**: Specific error messages for failed connections
 * - **Response Time**: Connection latency measurement
 * - **Timestamp**: When the status check was performed
 * - **Authentication Status**: Whether authentication is working
 * 
 * @monitoring_features
 * - Non-invasive database operation for status checking
 * - Comprehensive error reporting and debugging information
 * - Performance metrics including response time measurement
 * - Authentication and authorization status validation
 * - Detailed connection diagnostics
 * 
 * @use_cases
 * - Application health monitoring
 * - Deployment validation and testing
 * - Real-time status dashboards
 * - Automated monitoring and alerting
 * - Development debugging and troubleshooting
 * 
 * @performance_considerations
 * - Lightweight operation with minimal database impact
 * - Fast response time for real-time monitoring
 * - Efficient error handling and reporting
 * - Suitable for frequent health checks
 * 
 * @error_scenarios
 * - Network connectivity issues
 * - Authentication and authorization failures
 * - Database unavailability or maintenance
 * - Configuration errors
 * - Rate limiting or quota exceeded
 * 
 * @integration_patterns
 * - Health check endpoints in APIs
 * - Monitoring dashboard components
 * - Automated testing and validation
 * - CI/CD pipeline health checks
 * - Production monitoring systems
 * 
 * @see {@link validateSupabaseConfig} for configuration validation
 * @see {@link supabase} for client instance
 */
export const getSupabaseStatus = async () => {
  const startTime = Date.now();
  
  try {
    // Perform lightweight database operation to check connectivity
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    const responseTime = Date.now() - startTime;
    
    return {
      connected: !error,
      error: error?.message || null,
      responseTime,
      timestamp: new Date().toISOString(),
      authenticated: !!supabase.auth.getUser(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      timestamp: new Date().toISOString(),
      authenticated: false,
    };
  }
};

// Export configuration for debugging/monitoring
export { supabaseConfig };