/**
 * @fileoverview PRESENTATION-STYLES-002: Auth Demo Screen Styles
 * @description Styles für Auth Demo Screen mit moderne Material Design UI.
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthDemoScreenStyles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  
  // User Status Styles
  userInfo: {
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 2,
  },
  notLoggedIn: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  
  // Feature Grid Styles
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  implemented: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  pending: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  featureStatus: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  
  // Button Styles
  button: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  secondaryButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Rating Styles
  ratingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  // Achievement Styles
  achievementContainer: {
    alignItems: 'center',
    padding: 16,
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementStats: {
    alignItems: 'flex-start',
    width: '100%',
  },
  achievementStat: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 