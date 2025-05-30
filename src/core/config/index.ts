/**
 * @fileoverview CORE-CONFIG-INDEX: Core Configuration Exports
 * @description Central export point for all core configuration modules
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CoreConfig
 * @namespace Core.Config
 */

// Supabase configuration
export {
  supabase,
  getSupabaseAdmin,
  validateSupabaseConfig,
  getSupabaseStatus,
  supabaseConfig,
  type SupabaseConfig
} from './supabase.config';

// Database types
export type {
  Database,
  UserRow,
  UserInsert,
  UserUpdate,
  UserSessionRow,
  UserSessionInsert,
  UserSessionUpdate,
  SecurityEventRow,
  SecurityEventInsert,
  SecurityEventUpdate,
  MFAFactorRow,
  MFAFactorInsert,
  MFAFactorUpdate,
  UserStatus,
  OAuthProvider,
  MFAType,
  SecurityEventType,
  SecurityEventSeverity
} from './types/database.types';