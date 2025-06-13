/**
 * @fileoverview Global Immer Configuration
 * @description Globale Immer Plugin-Konfiguration für alle Zustand Stores
 * Dieses Modul muss als erstes geladen werden, bevor irgendwelche Stores erstellt werden.
 */

import { enableMapSet } from 'immer';

// Global Immer Plugin-Initialisierung
console.log('🔧 Initializing Immer plugins...');

// Enable MapSet Plugin für Set/Map Support in Zustand Stores
enableMapSet();

console.log('✅ Immer MapSet plugin enabled globally');

export const immerInitialized = true; 