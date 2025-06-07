import React, { useEffect, useState, type ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@features/auth/presentation/store/auth.store';
import { AuthServiceContainer } from '@features/auth/data/factories/auth-service.container';
import { ConsoleLogger } from '@core/logging/console.logger';

import { Environment } from '@core/config/environment.config.interface';
import * as RNLocalize from 'react-native-localize';
import i18n from '@core/i18n/i18n';

/**
 * Props for the AppInitializer component.
 */
interface AppInitializerProps {
  /** The application UI to render after initialization is complete. */
  children: ReactNode;
}

/**
 * Initializes core application dependencies and session state.
 * Blocks rendering until authentication status has been resolved.
 * Designed to wrap NavigationContainer or the app shell.
 */
export const AppInitializer = ({
  children,
}: AppInitializerProps): React.JSX.Element => {
  const { initializeSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        
        // 1. Initialize Auth Services
        const logger = new ConsoleLogger();
        const authContainer = AuthServiceContainer.getInstance();
        
        await authContainer.initialize({
          logger,
          enableBiometric: true,
          enableOAuth: true,
          enableMFA: true,
          enableCompliance: true,
          enableAuthOrchestrator: true,
          environment: Environment.DEVELOPMENT
        });

        console.log('✅ Auth services initialized');

        // 2. Use the store's initializeSession method instead of manual state setting
        console.log('🔍 Initializing session through auth store...');
        await initializeSession();

        console.log('✅ App initialization completed successfully');
        setIsReady(true);
      } catch (error) {
        console.error('🚨 App initialization failed:', error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, [initializeSession]);

  useEffect(() => {
    // Set device locale
    const deviceLocale = RNLocalize.getLocales()?.[0]?.languageCode ?? 'de';
    i18n.changeLanguage(deviceLocale);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
}); 