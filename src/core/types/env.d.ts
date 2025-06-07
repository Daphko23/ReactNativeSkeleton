/**
 * @fileoverview ENV-DECLARATIONS: Environment Variable Type Declarations
 * @description TypeScript declarations for environment variables used throughout the application with type safety and documentation
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Types
 * @namespace Core.Types.Environment
 * @category Configuration
 * @subcategory Environment
 */

/**
 * Environment Variable Module Declaration
 * 
 * Provides TypeScript type safety for environment variables accessed via the @env module.
 * Ensures compile-time validation of environment variable usage and enables IDE autocomplete
 * for configuration values.
 * 
 * @module @env
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory EnvironmentVariables
 * 
 * @example
 * Accessing environment variables:
 * ```tsx
 * import { SUPABASE_URL, API_URL } from '@env';
 * 
 * const config = {
 *   supabaseUrl: SUPABASE_URL,
 *   apiEndpoint: API_URL
 * };
 * ```
 * 
 * @example
 * Conditional configuration:
 * ```tsx
 * import { APP_NAME, API_URL } from '@env';
 * 
 * const getApiConfig = () => ({
 *   baseURL: API_URL,
 *   appName: APP_NAME,
 *   timeout: 5000
 * });
 * ```
 * 
 * @security
 * - Environment variables should not contain sensitive secrets in client-side code
 * - Use .env files for local development configuration
 * - Production values should be injected during build process
 * - Sensitive data should use secure configuration management
 * 
 * @configuration
 * Environment variables are typically defined in:
 * - .env (local development)
 * - .env.staging (staging environment)
 * - .env.production (production environment)
 * - CI/CD pipeline configuration
 * 
 * @validation
 * All environment variables should be:
 * - Defined with appropriate default values
 * - Validated at application startup
 * - Documented for deployment requirements
 * - Type-safe through these declarations
 * 
 * @deployment
 * Required for successful application deployment:
 * - All declared variables must be provided
 * - Values must be valid for target environment
 * - Secrets should be managed through secure channels
 * - Configuration should be environment-specific
 * 
 * @see {@link https://github.com/goatandsheep/react-native-dotenv} React Native DotEnv Documentation
 * @see {@link https://docs.expo.dev/guides/environment-variables/} Expo Environment Variables
 */
declare module '@env' {
  /**
   * Supabase Project URL
   * 
   * Base URL for the Supabase backend service providing authentication,
   * database, and real-time functionality. Must be a valid HTTPS URL
   * pointing to your Supabase project instance.
   * 
   * @constant {string} SUPABASE_URL
   * @required
   * @format https://your-project.supabase.co
   * @example 'https://xyzcompany.supabase.co'
   * @security Public URL, safe for client-side usage
   * @environment project-specific
   */
  export const SUPABASE_URL: string;

  /**
   * Supabase Anonymous API Key
   * 
   * Public anonymous key for Supabase client initialization. This key
   * enables public access to Supabase services with Row Level Security
   * policies applied. Safe for client-side exposure.
   * 
   * @constant {string} SUPABASE_ANON_KEY
   * @required
   * @format eyJ... (JWT format)
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   * @security Public key, RLS policies apply
   * @environment project-specific
   * @usage Client initialization, public API access
   */
  export const SUPABASE_ANON_KEY: string;

  /**
   * Primary API Base URL
   * 
   * Base URL for the primary application API endpoints. Used for
   * custom backend services, third-party integrations, and additional
   * API functionality beyond Supabase.
   * 
   * @constant {string} API_URL
   * @required
   * @format https://api.example.com
   * @example 'https://api.yourcompany.com'
   * @security Should use HTTPS in production
   * @environment environment-specific
   * @usage REST API calls, service integration
   */
  export const API_URL: string;

  /**
   * Application Display Name
   * 
   * Human-readable application name used for display purposes,
   * notifications, and branding throughout the application interface.
   * Should match the name configured in app stores.
   * 
   * @constant {string} APP_NAME
   * @required
   * @format Human-readable string
   * @example 'ReactNative Skeleton'
   * @usage UI display, notifications, branding
   * @branding Should match official app name
   */
  export const APP_NAME: string;
}
