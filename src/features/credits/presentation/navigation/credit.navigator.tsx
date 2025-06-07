/**
 * @fileoverview NAVIGATION-001: Credit Feature Navigator
 * @description Stack Navigator für alle Credit-bezogenen Screens.
 * Koordiniert Navigation zwischen Dashboard, Shop und Transaction History.
 * 
 * @businessRule BR-800: Credit feature navigation flow
 * @businessRule BR-801: Screen transition management
 * @businessRule BR-802: Parameter passing zwischen screens
 * 
 * @architecture React Navigation Stack Pattern
 * @architecture Feature-based navigation structure
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CreditNavigator
 * @namespace Credits.Presentation.Navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CreditStackParamList } from '../../../../core/navigation/navigation.types';
import { useTheme } from '@core/theme/theme.system';

// Credit Screens
import { CreditDashboard } from '../screens/credit-dashboard.screen';
import { CreditShop } from '../screens/credit-shop.screen';
import { CreditTransactions } from '../screens/credit-transactions.screen';

const Stack = createNativeStackNavigator<CreditStackParamList>();

/**
 * @component CreditNavigator
 * @description Stack Navigator für Credit Feature
 * 
 * @example Credit Navigation
 * ```typescript
 * // In Tab Navigator
 * <Tab.Screen
 *   name="CreditsTab"
 *   component={CreditNavigator}
 *   options={{ title: 'Credits' }}
 * />
 * ```
 */
export const CreditNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="CreditDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.colors.text,
        },
        animation: 'slide_from_right',
      }}
    >
      {/* Credit Dashboard - Main overview */}
      <Stack.Screen
        name="CreditDashboard"
        component={CreditDashboard}
        options={{
          title: 'Credits',
          headerLargeTitle: true,
        }}
      />

      {/* Credit Shop - In-app purchases */}
      <Stack.Screen
        name="CreditShop"
        component={CreditShop}
        options={{
          title: 'Credit Shop',
          presentation: 'modal',
        }}
      />

      {/* Credit Transactions - Transaction history */}
      <Stack.Screen
        name="CreditTransactions"
        component={CreditTransactions}
        options={{
          title: 'Transaktionen',
        }}
      />
    </Stack.Navigator>
  );
}; 