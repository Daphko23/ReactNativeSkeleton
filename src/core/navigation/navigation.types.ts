import {NavigatorScreenParams} from '@react-navigation/native';

// Auth-Flow
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  PasswordReset: undefined;
  PasswordChange: undefined;
  EmailVerification: { 
    email?: string; 
    token?: string; 
    type?: 'signup' | 'email_change' 
  } | undefined;
  AccountDeletion: undefined;
  SecuritySettings: undefined;
  AuthDemo: undefined;
};

// Matchday-Flow (als Tab)
export type MatchdayStackParamList = {
  MatchdayList: undefined;
  MatchdayForm: {matchdayId?: string} | undefined;
  MatchdayDetails: {
    matchdayId: string;
  };
};

// Credits-Flow (als Tab)
export type CreditStackParamList = {
  CreditDashboard: undefined;
  CreditShop: undefined;
  CreditTransactions: undefined;
  CreditTransactionDetails: {
    transactionId: string;
  };
};

// Tab-Navigator
export type MainTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  NotificationsTab: undefined;
  SettingsTab: undefined;
  // ThemeTab: undefined; // Entfernt - jetzt über HomeScreen zugänglich  
  // MatchdayTab: NavigatorScreenParams<MatchdayStackParamList>; // TODO: Implement when needed
};

// Root-Flow
export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};
