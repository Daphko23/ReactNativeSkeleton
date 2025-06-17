/**
 * @fileoverview Global Immer Configuration
 * @description Globale Immer Plugin-Konfiguration für alle Zustand Stores
 * Dieses Modul muss als erstes geladen werden, bevor irgendwelche Stores erstellt werden.
 */

import { enableMapSet } from 'immer';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for Immer configuration
const logger = LoggerFactory.createServiceLogger('ImmerConfig');

// Global Immer Plugin-Initialisierung
logger.info('Initializing Immer plugins', LogCategory.BUSINESS, {
  service: 'ImmerConfig',
  metadata: { pluginType: 'MapSet', stage: 'initialization' }
});

// Enable MapSet Plugin für Set/Map Support in Zustand Stores
enableMapSet();

logger.info('Immer MapSet plugin enabled globally', LogCategory.BUSINESS, {
  service: 'ImmerConfig',
  metadata: { pluginType: 'MapSet', enabled: true, stage: 'completed' }
});

export const immerInitialized = true; 