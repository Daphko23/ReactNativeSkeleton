/**
 * @fileoverview CORE-CONFIG-001: Supabase Configuration
 * @description Zentrale Supabase-Client-Konfiguration für Enterprise Auth
 * 
 * @businessRule BR-100: Centralized Supabase client configuration
 * @businessRule BR-101: Environment-based configuration management
 * @businessRule BR-102: Type-safe database schema integration
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SupabaseConfig
 * @namespace Core.Config
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

/**
 * @interface SupabaseConfig
 * @description Configuration interface for Supabase client
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  projectRef?: string;
  region?: string;
}

/**
 * @constant supabaseConfig
 * @description Environment-based Supabase configuration
 */
const supabaseConfig: SupabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  projectRef: process.env.EXPO_PUBLIC_SUPABASE_PROJECT_REF,
  region: process.env.EXPO_PUBLIC_SUPABASE_REGION || 'us-east-1',
};

/**
 * @constant supabase
 * @description Type-safe Supabase client instance
 * 
 * Features:
 * - Type-safe database operations
 * - Automatic session management
 * - Real-time subscriptions
 * - Row Level Security (RLS) support
 * - Built-in authentication
 * 
 * @example Basic usage
 * ```typescript
 * import { supabase } from '@core/config/supabase.config';
 * 
 * // Auth operations
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Database operations
 * const { data: users } = await supabase
 *   .from('users')
 *   .select('*')
 *   .eq('active', true);
 * ```
 */
export const supabase = createClient<Database>(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      // Auto-refresh token management
      autoRefreshToken: true,
      
      // Persist session in secure storage
      persistSession: true,
      
      // Detect session in URL for web/expo
      detectSessionInUrl: true,
      
      // Flow type for auth
      flowType: 'pkce',
      
      // Storage configuration for React Native
      storage: undefined, // Will use default AsyncStorage
    },
    
    // Global configuration
    global: {
      headers: {
        'X-Client-Info': 'ReactNativeSkeleton@1.0.0',
      },
    },
    
    // Real-time configuration  
    realtime: {
      // Enable heartbeat for connection stability
      heartbeatIntervalMs: 30000,
      
      // Reconnect on network issues
      reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),
    },
    
    // Database configuration
    db: {
      // Schema for multi-tenancy (if needed)
      schema: 'public',
    },
  }
);

/**
 * @function getSupabaseAdmin
 * @description Creates admin client with service role key
 * @returns Admin Supabase client with elevated permissions
 * 
 * @example Admin operations
 * ```typescript
 * const adminClient = getSupabaseAdmin();
 * 
 * // Admin-only operations
 * const { data } = await adminClient
 *   .from('users')
 *   .update({ role: 'admin' })
 *   .eq('id', userId);
 * ```
 */
export const getSupabaseAdmin = () => {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error('Service role key not configured');
  }
  
  return createClient<Database>(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'ReactNativeSkeleton-Admin@1.0.0',
        },
      },
    }
  );
};

/**
 * @function validateSupabaseConfig
 * @description Validates Supabase configuration
 * @returns True if configuration is valid
 */
export const validateSupabaseConfig = (): boolean => {
  const requiredFields = ['url', 'anonKey'];
  
  for (const field of requiredFields) {
    if (!supabaseConfig[field as keyof SupabaseConfig]) {
      console.error(`Missing required Supabase config: ${field}`);
      return false;
    }
  }
  
  // Validate URL format
  try {
    new URL(supabaseConfig.url);
  } catch {
    console.error('Invalid Supabase URL format');
    return false;
  }
  
  return true;
};

/**
 * @function getSupabaseStatus
 * @description Gets current Supabase connection status
 * @returns Connection status information
 */
export const getSupabaseStatus = async () => {
  try {
    const { data: _data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    return {
      connected: !error,
      error: error?.message,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Export configuration for debugging/monitoring
export { supabaseConfig };