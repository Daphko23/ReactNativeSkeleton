/**
 * Integration Test Utilities
 *
 * @fileoverview Comprehensive setup utilities für Auth Integration Tests.
 * Provides real test environment with Navigation, TanStack Query, and Mock Services.
 *
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Integration Test Utils
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';

// Mock i18n first (before using it)
const mockI18n = {
  t: (key: string) => key,
  language: 'de',
  changeLanguage: () => Promise.resolve(),
  init: () => Promise.resolve(),
  loadResources: () => Promise.resolve(),
  use: () => mockI18n,
  modules: {},
  options: {},
  services: {},
  store: {},
  format: () => '',
  exists: () => true,
  getResource: () => '',
  hasResourceBundle: () => true,
  getResourceBundle: () => ({}),
  addResourceBundle: () => {},
  removeResourceBundle: () => {},
  addResource: () => {},
  addResources: () => {},
  removeResource: () => {},
  getDataByLanguage: () => ({}),
  getFixedT: () => (key: string) => key,
  emit: () => {},
  on: () => {},
  off: () => {},
  languages: ['de'],
  dir: () => 'ltr',
  resolvedLanguage: 'de',
  isLanguageChangingTo: null,
} as any;

// Create simple mock components for React Native testing
const MockMainScreen = () => <div>Main App</div>;
const MockLoginScreen = () => <div>Login Screen</div>;

// Create Test Navigation Stack
const TestStack = createNativeStackNavigator();

const TestNavigator: React.FC<{ initialRoute?: string }> = ({
  initialRoute = 'Login',
}) => (
  <TestStack.Navigator initialRouteName={initialRoute}>
    <TestStack.Screen name="Login" component={MockLoginScreen} />
    <TestStack.Screen name="Main" component={MockMainScreen} />
  </TestStack.Navigator>
);

// Test Query Client Configuration
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Integration Test Wrapper
interface IntegrationTestWrapperProps {
  children: React.ReactNode;
  initialRoute?: string;
  queryClient?: QueryClient;
}

export const IntegrationTestWrapper: React.FC<IntegrationTestWrapperProps> = ({
  children,
  initialRoute = 'Login',
  queryClient: providedQueryClient,
}) => {
  const queryClient = providedQueryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={mockI18n}>
        <NavigationContainer>
          <TestNavigator initialRoute={initialRoute} />
          {children}
        </NavigationContainer>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

// Custom Render für Integration Tests
export const renderWithIntegration = (
  ui: React.ReactElement,
  options: RenderOptions & {
    initialRoute?: string;
    queryClient?: QueryClient;
  } = {}
) => {
  const { initialRoute, queryClient, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <IntegrationTestWrapper
      initialRoute={initialRoute}
      queryClient={queryClient}
    >
      {children}
    </IntegrationTestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock Navigation für Tests
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  canGoBack: jest.fn(() => false),
  getId: jest.fn(),
});

// Test Data Factory
export const createTestUser = (overrides = {}) => ({
  id: 'test-user-123',
  email: 'test@example.com',
  username: 'testuser',
  emailVerified: true,
  role: 'user',
  createdAt: new Date('2024-01-01'),
  lastSignInAt: new Date('2024-01-15'),
  ...overrides,
});

// Mock Supabase Responses
export const mockSupabaseResponses = {
  loginSuccess: {
    data: {
      user: createTestUser(),
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000,
      },
    },
    error: null,
  },

  loginFailure: {
    data: { user: null, session: null },
    error: {
      message: 'Invalid login credentials',
      status: 400,
    },
  },

  networkError: {
    data: null,
    error: {
      message: 'Network request failed',
      status: 500,
    },
  },
};

// Integration Test Assertions
export const waitForNavigation = async (
  navigation: any,
  expectedRoute: string,
  timeout = 5000
) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Navigation to ${expectedRoute} did not occur within ${timeout}ms`
        )
      );
    }, timeout);

    // Mock implementation - in real tests would check actual navigation state
    if (
      navigation.navigate.mock.calls.some(
        (call: any) => call[0] === expectedRoute
      )
    ) {
      clearTimeout(timer);
      resolve(true);
    }
  });
};

// Loading State Helpers
export const waitForLoadingToComplete = async (screen: any, timeout = 5000) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (!screen.queryByTestId('loading-indicator')) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error(`Loading did not complete within ${timeout}ms`);
};

// Error State Helpers
export const expectErrorMessage = (screen: any, expectedMessage: string) => {
  const errorElement = screen.getByTestId('error-message');
  expect(errorElement).toHaveTextContent(expectedMessage);
};

// Auth State Helpers
export const expectUserAuthenticated = async (
  queryClient: QueryClient,
  expectedUser: any
) => {
  // In real implementation, would check auth state from the store
  const authData = queryClient.getQueryData(['auth', 'currentUser']);
  expect(authData).toEqual(expectedUser);
};

// Cleanup Utilities
export const cleanupIntegrationTest = (queryClient: QueryClient) => {
  queryClient.clear();
  jest.clearAllMocks();
};

export default mockI18n;
