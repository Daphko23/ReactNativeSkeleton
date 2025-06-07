import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './core/theme/theme.system';
import AppNavigator from './core/navigation/app-navigator';
import { ErrorBoundary } from '@shared/errors/error-boundary';
import { AppInitializer } from '@core/app/app-initializer.component';

// Import i18n configuration
import './core/i18n/i18n';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Deep Link Configuration
const linking = {
  prefixes: ['de.daphko.skeleton://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'auth/login',
          Register: 'auth/register',
          Callback: 'auth/callback',
          Success: 'auth/success',
          Error: 'auth/error',
        },
      },
      Main: {
        screens: {
          HomeTab: 'home',
          ProfileTab: 'profile',
          NotificationsTab: 'notifications',
          ThemeTab: 'theme',
          CreditsTab: 'credits',
        },
      },
    },
  },
};

/**
 * Main App Component with proper error handling, theming, and query client setup
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PaperProvider>
              <AppInitializer>
                <AppNavigator linking={linking} />
              </AppInitializer>
            </PaperProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
