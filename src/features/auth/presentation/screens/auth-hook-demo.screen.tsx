/**
 * Auth Hook Demo Screen - Demonstration des Hook-zentrierten Patterns
 * 
 * @fileoverview Demo Screen zur Demonstration des neuen Hook-zentrierten Auth Patterns.
 * Zeigt die Verwendung von useAuth Hook vs. dem alten Store-zentrierten Pattern.
 * 
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation/Screens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks';

/**
 * @component AuthHookDemoScreen
 * @description Demo Screen für das neue Hook-zentrierte Auth Pattern
 * 
 * @features
 * - Login/Register/Logout mit useAuth Hook
 * - State Management über schlanken Store
 * - Error Handling Demonstration
 * - Real-time Authentication Status
 * 
 * @architecture Hook-zentriert
 * - ✅ Business Logic in Hooks
 * - ✅ State Management im Store
 * - ✅ DI Container Integration
 * - ✅ Separation of Concerns
 */
export const AuthHookDemoScreen: React.FC = () => {
  // ==========================================
  // 🪝 HOOK USAGE (Neues Pattern)
  // ==========================================
  
  const {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    checkAuthStatus,
    getCurrentUser,
    clearError,
  } = useAuth();

  // ==========================================
  // 📱 LOCAL STATE (UI Specific)
  // ==========================================
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ==========================================
  // 🎯 EVENT HANDLERS
  // ==========================================
  
  const handleLogin = async () => {
    try {
      clearError();
      const loggedInUser = await login(email, password);
      Alert.alert('Success', `Welcome back, ${loggedInUser.email}!`);
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleRegister = async () => {
    try {
      clearError();
      const newUser = await register(email, password, confirmPassword);
      Alert.alert('Success', `Account created for ${newUser.email}!`);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      Alert.alert('Logout Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleCheckStatus = async () => {
    try {
      const status = await checkAuthStatus();
      Alert.alert('Auth Status', `Authenticated: ${status}`);
    } catch (error) {
      Alert.alert('Status Check Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        Alert.alert('Current User', `Email: ${currentUser.email}\nID: ${currentUser.id}`);
      } else {
        Alert.alert('No User', 'No current user found');
      }
    } catch (error) {
      Alert.alert('Get User Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // ==========================================
  // 🎨 RENDER
  // ==========================================
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🪝 Auth Hook Demo</Text>
      <Text style={styles.subtitle}>Hook-zentriertes Pattern Demonstration</Text>

      {/* Auth Status Display */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>📊 Current State</Text>
        <Text style={styles.statusText}>Authenticated: {isAuthenticated ? '✅' : '❌'}</Text>
        <Text style={styles.statusText}>Loading: {isLoading ? '⏳' : '✅'}</Text>
        <Text style={styles.statusText}>User: {user ? user.email : 'None'}</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View>

      {/* Auth Forms */}
      {!isAuthenticated ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>🔐 Authentication</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password (for Register)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.registerButton]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>👋 Welcome, {user?.email}!</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Utility Actions */}
      <View style={styles.utilityContainer}>
        <Text style={styles.utilityTitle}>🛠️ Utility Functions</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.utilityButton]} 
          onPress={handleCheckStatus}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Check Auth Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.utilityButton]} 
          onPress={handleGetCurrentUser}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Get Current User</Text>
        </TouchableOpacity>
        
        {error && (
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={clearError}
          >
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pattern Comparison */}
      <View style={styles.comparisonContainer}>
        <Text style={styles.comparisonTitle}>📈 Pattern Comparison</Text>
        <Text style={styles.comparisonText}>
          ✅ Hook-zentriert: Business Logic in Hooks{'\n'}
          ✅ Store: Nur State Management{'\n'}
          ✅ DI Container: UseCase Injection{'\n'}
          ✅ Testbarkeit: Isolierte Hooks{'\n'}
          ✅ Wiederverwendbarkeit: Modulare Hooks
        </Text>
      </View>
    </ScrollView>
  );
};

// ==========================================
// 🎨 STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#3498db',
  },
  registerButton: {
    backgroundColor: '#2ecc71',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  utilityButton: {
    backgroundColor: '#9b59b6',
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: '#f39c12',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  utilityContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  utilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  comparisonText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
}); 