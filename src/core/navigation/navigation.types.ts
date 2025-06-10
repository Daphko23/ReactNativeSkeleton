/**
 * @fileoverview NAVIGATION-TYPES: Enterprise Navigation Type System
 * @description Comprehensive TypeScript type definitions for application navigation with type-safe routing, parameter validation, and enterprise navigation patterns
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types
 * @category Navigation
 * @subcategory TypeDefinitions
 */

import {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Authentication Flow Parameter List
 * 
 * Type-safe parameter definitions for the authentication navigation stack.
 * Provides comprehensive authentication flow support including login, registration,
 * password management, email verification, and security settings.
 * 
 * @type AuthStackParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Authentication
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.AuthStackParamList
 * 
 * @description
 * Complete type definition for authentication navigation stack providing
 * type-safe routing and parameter validation for all authentication-related
 * screens. Supports complex authentication workflows with optional parameters.
 * 
 * @example
 * Basic authentication navigation:
 * ```tsx
 * import { AuthStackParamList } from '@/core/navigation/navigation.types';
 * 
 * type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
 * 
 * const LoginScreen = ({ navigation }: { navigation: AuthNavigationProp }) => {
 *   const handleLogin = () => {
 *     navigation.navigate('EmailVerification', {
 *       email: 'user@example.com',
 *       type: 'signup'
 *     });
 *   };
 * };
 * ```
 * 
 * @example
 * Email verification with parameters:
 * ```tsx
 * navigation.navigate('EmailVerification', {
 *   email: 'user@example.com',
 *   token: 'verification-token-123',
 *   type: 'email_change'
 * });
 * ```
 * 
 * @example
 * Type-safe route parameters access:
 * ```tsx
 * type EmailVerificationRouteProp = RouteProp<AuthStackParamList, 'EmailVerification'>;
 * 
 * const EmailVerificationScreen = ({ route }: { route: EmailVerificationRouteProp }) => {
 *   const { email, token, type } = route.params || {};
 *   // TypeScript ensures type safety
 * };
 * ```
 * 
 * @authentication_screens
 * - **Login**: User authentication entry point
 * - **Register**: New user account creation
 * - **PasswordReset**: Password recovery workflow
 * - **PasswordChange**: Authenticated password update
 * - **EmailVerification**: Email confirmation for signup/changes
 * - **AccountDeletion**: Account termination workflow
 * - **SecuritySettings**: Security configuration management
 * - **AuthDemo**: Authentication feature demonstration
 * 
 * @parameter_patterns
 * - **undefined**: Screens with no parameters
 * - **Optional Objects**: Screens with optional parameter sets
 * - **Required Parameters**: Screens requiring specific data
 * - **Union Types**: Parameters with multiple valid types
 * 
 * @email_verification_types
 * - **signup**: New user email verification
 * - **email_change**: Email address change verification
 * 
 * @security_considerations
 * - Parameters may contain sensitive data
 * - Token parameters should be handled securely
 * - Email parameters require validation
 * - Type safety prevents parameter injection
 * 
 * @use_cases
 * - User onboarding flows
 * - Password recovery processes
 * - Email verification workflows
 * - Security management
 * - Account lifecycle management
 * 
 * @best_practices
 * - Always use type-safe navigation
 * - Validate parameters at screen entry
 * - Handle undefined parameters gracefully
 * - Implement proper error boundaries
 * - Test all navigation scenarios
 * 
 * @dependencies
 * - @react-navigation/native: Navigation parameter types
 * 
 * @see {@link RootStackParamList} for root navigation structure
 * @see {@link MainTabParamList} for main application navigation
 * 
 * @todo Add biometric authentication screen types
 * @todo Implement MFA screen parameter types
 * @todo Add OAuth callback parameter types
 */
export type AuthStackParamList = {
  /**
   * Login Screen - User authentication entry point
   * No parameters required for basic login screen
   * 
   * @screen Login
   * @parameters undefined
   * @description Primary user authentication screen
   */
  Login: undefined;

  /**
   * Registration Screen - New user account creation
   * No parameters required for registration screen
   * 
   * @screen Register
   * @parameters undefined
   * @description New user account creation form
   */
  Register: undefined;

  /**
   * Password Reset Screen - Password recovery workflow
   * No parameters required for password reset initiation
   * 
   * @screen PasswordReset
   * @parameters undefined
   * @description Password recovery and reset workflow
   */
  PasswordReset: undefined;

  /**
   * Password Change Screen - Authenticated password update
   * No parameters required for authenticated users
   * 
   * @screen PasswordChange
   * @parameters undefined
   * @description Authenticated user password change form
   */
  PasswordChange: undefined;

  /**
   * Email Verification Screen - Email confirmation workflow
   * Supports both signup and email change verification flows
   * 
   * @screen EmailVerification
   * @parameters Optional verification data object
   * @description Email verification for various authentication flows
   * 
   * @parameter_structure
   * ```tsx
   * {
   *   email?: string;              // Email address to verify
   *   token?: string;              // Verification token
   *   type?: 'signup' | 'email_change';  // Verification context
   * } | undefined
   * ```
   */
  EmailVerification: { 
    /** Email address being verified */
    email?: string; 
    /** Verification token for validation */
    token?: string; 
    /** Type of verification process */
    type?: 'signup' | 'email_change' 
  } | undefined;

  /**
   * Account Deletion Screen - Account termination workflow
   * No parameters required for account deletion flow
   * 
   * @screen AccountDeletion
   * @parameters undefined
   * @description Account termination and data deletion workflow
   */
  AccountDeletion: undefined;

  /**
   * Security Settings Screen - Security configuration management
   * No parameters required for security settings access
   * 
   * @screen SecuritySettings
   * @parameters undefined
   * @description Security configuration and preference management
   */
  SecuritySettings: undefined;

  /**
   * Authentication Demo Screen - Feature demonstration
   * No parameters required for demo screen
   * 
   * @screen AuthDemo
   * @parameters undefined
   * @description Authentication feature demonstration and testing
   */
  AuthDemo: undefined;
};

/**
 * Matchday Flow Parameter List
 * 
 * Type-safe parameter definitions for matchday management navigation.
 * Provides comprehensive matchday workflow support including listing,
 * creation, editing, and detailed viewing of matchday events.
 * 
 * @type MatchdayStackParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory FeatureNavigation
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.MatchdayStackParamList
 * 
 * @description
 * Future-ready type definition for matchday navigation stack enabling
 * type-safe routing for sports event management functionality.
 * Designed for extensibility and enterprise sports application requirements.
 * 
 * @example
 * Matchday navigation usage:
 * ```tsx
 * import { MatchdayStackParamList } from '@/core/navigation/navigation.types';
 * 
 * type MatchdayNavigationProp = NativeStackNavigationProp<MatchdayStackParamList>;
 * 
 * const MatchdayListScreen = ({ navigation }: { navigation: MatchdayNavigationProp }) => {
 *   const handleCreateMatchday = () => {
 *     navigation.navigate('MatchdayForm');
 *   };
 * 
 *   const handleEditMatchday = (matchdayId: string) => {
 *     navigation.navigate('MatchdayForm', { matchdayId });
 *   };
 * 
 *   const handleViewDetails = (matchdayId: string) => {
 *     navigation.navigate('MatchdayDetails', { matchdayId });
 *   };
 * };
 * ```
 * 
 * @example
 * Type-safe parameter access:
 * ```tsx
 * type MatchdayDetailsRouteProp = RouteProp<MatchdayStackParamList, 'MatchdayDetails'>;
 * 
 * const MatchdayDetailsScreen = ({ route }: { route: MatchdayDetailsRouteProp }) => {
 *   const { matchdayId } = route.params;
 *   // TypeScript ensures matchdayId is always a string
 * };
 * ```
 * 
 * @matchday_screens
 * - **MatchdayList**: Overview of all matchdays
 * - **MatchdayForm**: Create/edit matchday interface
 * - **MatchdayDetails**: Detailed matchday information
 * 
 * @parameter_patterns
 * - **Creation Mode**: MatchdayForm with no parameters
 * - **Edit Mode**: MatchdayForm with matchdayId parameter
 * - **Detail View**: MatchdayDetails with required matchdayId
 * 
 * @use_cases
 * - Sports event management
 * - Tournament organization
 * - Match scheduling
 * - Team coordination
 * - Event tracking
 * 
 * @future_features
 * - Team selection screens
 * - Player statistics views
 * - Match result entry
 * - Live scoring interfaces
 * 
 * @see {@link MainTabParamList} for tab integration
 * 
 * @todo Implement when matchday feature is activated
 * @todo Add team selection parameter types
 * @todo Include match result parameter structures
 */
export type MatchdayStackParamList = {
  /**
   * Matchday List Screen - Overview of all matchdays
   * No parameters required for list view
   * 
   * @screen MatchdayList
   * @parameters undefined
   * @description Comprehensive list of all matchday events
   */
  MatchdayList: undefined;

  /**
   * Matchday Form Screen - Create or edit matchday
   * Optional matchdayId parameter for edit mode
   * 
   * @screen MatchdayForm
   * @parameters Optional matchday identifier for editing
   * @description Matchday creation and editing interface
   */
  MatchdayForm: {matchdayId?: string} | undefined;

  /**
   * Matchday Details Screen - Detailed matchday information
   * Required matchdayId parameter for specific matchday
   * 
   * @screen MatchdayDetails
   * @parameters Required matchday identifier object
   * @description Detailed view of specific matchday event
   */
  MatchdayDetails: {
    /** Unique identifier for the matchday */
    matchdayId: string;
  };
};

/**
 * Credits Flow Parameter List
 * 
 * Type-safe parameter definitions for credits and payment management navigation.
 * Provides comprehensive financial transaction support including dashboard,
 * purchasing, transaction history, and detailed transaction viewing.
 * 
 * @type CreditStackParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory FeatureNavigation
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.CreditStackParamList
 * 
 * @description
 * Complete type definition for credits navigation stack enabling
 * type-safe routing for financial and payment functionality.
 * Supports enterprise-grade financial workflows and transaction tracking.
 * 
 * @example
 * Credits navigation usage:
 * ```tsx
 * import { CreditStackParamList } from '@/core/navigation/navigation.types';
 * 
 * type CreditNavigationProp = NativeStackNavigationProp<CreditStackParamList>;
 * 
 * const CreditDashboardScreen = ({ navigation }: { navigation: CreditNavigationProp }) => {
 *   const handlePurchaseCredits = () => {
 *     navigation.navigate('CreditShop');
 *   };
 * 
 *   const handleViewTransactions = () => {
 *     navigation.navigate('CreditTransactions');
 *   };
 * 
 *   const handleViewTransaction = (transactionId: string) => {
 *     navigation.navigate('CreditTransactionDetails', { transactionId });
 *   };
 * };
 * ```
 * 
 * @example
 * Transaction details with type safety:
 * ```tsx
 * type TransactionDetailsRouteProp = RouteProp<CreditStackParamList, 'CreditTransactionDetails'>;
 * 
 * const TransactionDetailsScreen = ({ route }: { route: TransactionDetailsRouteProp }) => {
 *   const { transactionId } = route.params;
 *   // TypeScript ensures transactionId is always a string
 * };
 * ```
 * 
 * @credit_screens
 * - **CreditDashboard**: Main credits overview and balance
 * - **CreditShop**: Credit purchasing interface
 * - **CreditTransactions**: Transaction history listing
 * - **CreditTransactionDetails**: Detailed transaction information
 * 
 * @financial_features
 * - Credit balance management
 * - Purchase workflows
 * - Transaction tracking
 * - Payment processing
 * - Billing history
 * 
 * @security_considerations
 * - Transaction IDs should be validated
 * - Financial data requires secure handling
 * - Payment flows need encryption
 * - User authorization for financial operations
 * 
 * @use_cases
 * - In-app purchases
 * - Credit-based monetization
 * - Transaction tracking
 * - Financial reporting
 * - Payment method management
 * 
 * @compliance_requirements
 * - PCI DSS compliance for payments
 * - Financial data protection
 * - Audit trail maintenance
 * - Regulatory reporting
 * 
 * @see {@link MainTabParamList} for tab integration
 * 
 * @todo Add payment method parameter types
 * @todo Implement subscription parameter structures
 * @todo Add refund workflow parameter types
 */
export type CreditStackParamList = {
  /**
   * Credit Dashboard Screen - Main credits overview
   * No parameters required for dashboard view
   * 
   * @screen CreditDashboard
   * @parameters undefined
   * @description Main credits overview with balance and quick actions
   */
  CreditDashboard: undefined;

  /**
   * Credit Shop Screen - Credit purchasing interface
   * No parameters required for shop view
   * 
   * @screen CreditShop
   * @parameters undefined
   * @description Credit packages and purchasing interface
   */
  CreditShop: undefined;

  /**
   * Credit Transactions Screen - Transaction history
   * No parameters required for transaction list
   * 
   * @screen CreditTransactions
   * @parameters undefined
   * @description Comprehensive transaction history listing
   */
  CreditTransactions: undefined;

  /**
   * Credit Transaction Details Screen - Detailed transaction view
   * Required transactionId parameter for specific transaction
   * 
   * @screen CreditTransactionDetails
   * @parameters Required transaction identifier object
   * @description Detailed view of specific financial transaction
   */
  CreditTransactionDetails: {
    /** Unique identifier for the transaction */
    transactionId: string;
  };
};

/**
 * Home Stack Parameter List
 * 
 * Type-safe parameter definitions for the home stack navigation.
 * Provides comprehensive navigation support for home screens and demos.
 * 
 * @type HomeStackParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory HomeNavigation
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.HomeStackParamList
 */
export type HomeStackParamList = {
  /**
   * Home Main Screen - Primary home interface
   * No parameters required for main home screen
   */
  HomeMain: undefined;

  /**
   * Theme Demo Screen - UI theming demonstration
   * No parameters required for theme demo
   */
  ThemeDemo: undefined;

  /**
   * Profile Compliance Demo Screen - Enterprise compliance demonstration
   * No parameters required for compliance demo
   */
  ProfileCompliance: undefined;

  /**
   * Auth GDPR Demo Screen - Authentication GDPR audit demonstration
   * No parameters required for auth GDPR demo
   */
  AuthGDPRDemo: undefined;
};

/**
 * Main Tab Parameter List
 * 
 * Type-safe parameter definitions for the main application tab navigation.
 * Provides the primary navigation structure for authenticated users with
 * access to core application features and functionality.
 * 
 * @type MainTabParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory PrimaryNavigation
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.MainTabParamList
 * 
 * @description
 * Central navigation type definition for the main application tab system.
 * Defines the core navigation structure for authenticated users accessing
 * primary application features through bottom tab navigation.
 * 
 * @example
 * Tab navigation usage:
 * ```tsx
 * import { MainTabParamList } from '@/core/navigation/navigation.types';
 * 
 * type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
 * 
 * const MyComponent = ({ navigation }: { navigation: MainTabNavigationProp }) => {
 *   const navigateToProfile = () => {
 *     navigation.navigate('ProfileTab');
 *   };
 * 
 *   const navigateToNotifications = () => {
 *     navigation.navigate('NotificationsTab');
 *   };
 * };
 * ```
 * 
 * @example
 * Tab switching with type safety:
 * ```tsx
 * const tabNavigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
 * 
 * const handleTabSwitch = (tab: keyof MainTabParamList) => {
 *   tabNavigation.navigate(tab);
 * };
 * ```
 * 
 * @tab_structure
 * - **HomeTab**: Main application entry and quick actions
 * - **ProfileTab**: User profile and account management
 * - **NotificationsTab**: Notification center and alerts
 * - **SettingsTab**: Application settings and configuration
 * 
 * @navigation_patterns
 * - Bottom tab navigation for primary features
 * - No parameters required for tab screens
 * - Nested navigation within each tab
 * - Consistent access to core functionality
 * 
 * @accessibility_features
 * - Tab labels for screen readers
 * - Touch target optimization
 * - High contrast support
 * - Voice navigation compatibility
 * 
 * @future_tabs
 * - ThemeTab: Removed - now accessible via HomeScreen
 * - MatchdayTab: Planned for future sports feature implementation
 * 
 * @use_cases
 * - Primary app navigation
 * - Feature discovery
 * - Quick access to core functions
 * - User workflow management
 * 
 * @see {@link RootStackParamList} for root navigation integration
 * @see {@link NavigatorScreenParams} for nested navigation support
 * 
 * @todo Consider adding badge support for notification counts
 * @todo Implement dynamic tab visibility based on user permissions
 * @todo Add analytics tracking for tab usage
 */
export type MainTabParamList = {
  /**
   * Home Tab - Main application entry point
   * No parameters required for home tab
   * 
   * @tab HomeTab
   * @parameters undefined
   * @description Primary application entry with quick actions and navigation
   */
  HomeTab: undefined;

  /**
   * Profile Tab - User profile and account management
   * No parameters required for profile tab
   * 
   * @tab ProfileTab
   * @parameters undefined
   * @description User profile, settings, and account management interface
   */
  ProfileTab: undefined;

  /**
   * Notifications Tab - Notification center and alerts
   * No parameters required for notifications tab
   * 
   * @tab NotificationsTab
   * @parameters undefined
   * @description Notification center with alerts and messages
   */
  NotificationsTab: undefined;

  /**
   * Settings Tab - Application settings and configuration
   * No parameters required for settings tab
   * 
   * @tab SettingsTab
   * @parameters undefined
   * @description Application settings, preferences, and configuration
   */
  SettingsTab: undefined;

  // ThemeTab: undefined; // Removed - now accessible via HomeScreen
  // MatchdayTab: NavigatorScreenParams<MatchdayStackParamList>; // TODO: Implement when needed
};

/**
 * Root Stack Parameter List
 * 
 * Type-safe parameter definitions for the root application navigation stack.
 * Provides the highest-level navigation structure managing authentication
 * state and main application access with type-safe nested navigation support.
 * 
 * @type RootStackParamList
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory RootNavigation
 * @module Core.Navigation.Types
 * @namespace Core.Navigation.Types.RootStackParamList
 * 
 * @description
 * Top-level navigation type definition managing the fundamental application
 * navigation structure. Controls access between authentication flows and
 * main application functionality with comprehensive type safety.
 * 
 * @example
 * Root navigation usage:
 * ```tsx
 * import { RootStackParamList } from '@/core/navigation/navigation.types';
 * 
 * type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
 * 
 * const AppNavigator = () => {
 *   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
 * 
 *   return (
 *     <Stack.Navigator>
 *       {isAuthenticated ? (
 *         <Stack.Screen name="Main" component={MainTabNavigator} />
 *       ) : (
 *         <Stack.Screen name="Auth" component={AuthNavigator} />
 *       )}
 *     </Stack.Navigator>
 *   );
 * };
 * ```
 * 
 * @example
 * Navigation between root flows:
 * ```tsx
 * const navigation = useNavigation<RootNavigationProp>();
 * 
 * const handleLogout = () => {
 *   // Clear auth state, navigation will automatically switch to Auth
 *   authStore.logout();
 * };
 * 
 * const handleLogin = () => {
 *   // Set auth state, navigation will automatically switch to Main
 *   authStore.login(userData);
 * };
 * ```
 * 
 * @root_flows
 * - **Auth**: Authentication and onboarding flow
 * - **Main**: Primary application with tab navigation
 * 
 * @navigation_architecture
 * - Root level: Authentication state management
 * - Auth flow: Login, registration, and security
 * - Main flow: Authenticated user features
 * - Nested navigation: Tabs and feature-specific stacks
 * 
 * @state_management
 * - Authentication-aware routing
 * - Automatic flow switching
 * - State persistence across sessions
 * - Deep linking integration
 * 
 * @security_features
 * - Authentication guards
 * - Protected route access
 * - Session validation
 * - Secure state transitions
 * 
 * @type_safety_benefits
 * - Compile-time navigation validation
 * - Parameter type checking
 * - Nested navigation type safety
 * - IntelliSense support
 * 
 * @use_cases
 * - Application bootstrap navigation
 * - Authentication flow management
 * - Main application access control
 * - Deep linking coordination
 * 
 * @see {@link AuthStackParamList} for authentication navigation
 * @see {@link MainTabParamList} for main application navigation
 * @see {@link NavigatorScreenParams} for nested parameter support
 * 
 * @todo Add loading state navigation
 * @todo Implement onboarding flow navigation
 * @todo Add error state navigation handling
 */
export type RootStackParamList = {
  /**
   * Authentication Flow - Login and registration
   * No parameters required for auth flow entry
   * 
   * @flow Auth
   * @parameters undefined
   * @description Complete authentication and onboarding flow
   */
  Auth: undefined;

  /**
   * Main Application Flow - Authenticated user interface
   * Nested navigation parameters from MainTabParamList
   * 
   * @flow Main
   * @parameters NavigatorScreenParams<MainTabParamList>
   * @description Primary application interface with tab navigation
   */
  Main: NavigatorScreenParams<MainTabParamList>;
};

/**
 * @summary
 * The navigation types module provides comprehensive TypeScript type definitions
 * for enterprise-grade navigation with type-safe routing, parameter validation,
 * and scalable navigation architecture. Essential for maintaining navigation
 * consistency and developer experience across large React Native applications.
 * 
 * @key_features
 * - Complete type safety for all navigation operations
 * - Nested navigation parameter support
 * - Authentication-aware navigation structure
 * - Feature-specific navigation stacks
 * - Enterprise-grade navigation patterns
 * - Comprehensive parameter validation
 * - Scalable navigation architecture
 * 
 * @architectural_benefits
 * - Compile-time navigation validation
 * - IntelliSense support for navigation
 * - Prevents navigation runtime errors
 * - Maintains navigation consistency
 * - Enables confident refactoring
 * - Supports complex navigation hierarchies
 * 
 * @production_readiness
 * - Type-safe parameter passing
 * - Comprehensive error prevention
 * - Maintainable navigation structure
 * - Scalable for large applications
 * - Deep linking type support
 * 
 * @module_exports
 * - AuthStackParamList: Authentication flow types
 * - MatchdayStackParamList: Matchday feature types
 * - CreditStackParamList: Credits feature types
 * - MainTabParamList: Main tab navigation types
 * - RootStackParamList: Root navigation types
 * 
 * @dependencies
 * - @react-navigation/native: Core navigation types
 * 
 * @see {@link https://reactnavigation.org/docs/typescript/} React Navigation TypeScript Guide
 */
