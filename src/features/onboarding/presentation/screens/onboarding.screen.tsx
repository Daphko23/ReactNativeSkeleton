/**
 * Onboarding Screen
 * Modern onboarding flow with smooth animations and user-friendly UX
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTranslation } from 'react-i18next';
import { useTheme, createThemedStyles } from '../../../../core/theme/theme.system';

import { errorMonitoring } from '@core/monitoring/error-monitoring.service';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

const useStyles = createThemedStyles((theme) => {
  const { width: _SCREEN_WIDTH, height: _SCREEN_HEIGHT } = Dimensions.get('window');
  
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    safeArea: {
      flex: 1,
    },
    skipButton: {
      position: 'absolute' as const,
      top: 50,
      right: 20,
      zIndex: 10,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    skipText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: theme.typography.fontSizes.base,
      fontWeight: theme.typography.fontWeights.medium,
    },
    pagerView: {
      flex: 1,
    },
    stepContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing[6],
    },
    stepContent: {
      alignItems: 'center' as const,
      maxWidth: 350,
    },
    stepIcon: {
      fontSize: 80,
      marginBottom: theme.spacing[6],
    },
    stepTitle: {
      fontSize: theme.typography.fontSizes['2xl'],
      fontWeight: theme.typography.fontWeights.bold,
      color: 'white',
      textAlign: 'center' as const,
      marginBottom: theme.spacing[4],
    },
    stepDescription: {
      fontSize: theme.typography.fontSizes.lg,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center' as const,
      lineHeight: 26,
      marginBottom: theme.spacing[10],
    },
    featuresContainer: {
      width: '100%' as const,
    },
    featureItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing[4],
      paddingHorizontal: theme.spacing[5],
    },
    featureIcon: {
      fontSize: theme.typography.fontSizes.xl,
      color: 'white',
      marginRight: theme.spacing[3],
      fontWeight: theme.typography.fontWeights.bold,
    },
    featureText: {
      fontSize: theme.typography.fontSizes.base,
      color: 'rgba(255, 255, 255, 0.9)',
      flex: 1,
    },
    indicatorContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing[6],
    },
    indicator: {
      width: 10,
      height: 10,
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      marginHorizontal: theme.spacing[1],
    },
    activeIndicator: {
      backgroundColor: 'white',
      transform: [{ scale: 1.2 }],
    },
    navigationContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing[6],
      paddingBottom: theme.spacing[10],
    },
    backButton: {
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[3],
    },
    backButtonText: {
      fontSize: theme.typography.fontSizes.base,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: theme.typography.fontWeights.medium,
    },
    spacer: {
      flex: 1,
    },
    nextButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing[6],
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    nextButtonText: {
      fontSize: theme.typography.fontSizes.base,
      color: 'white',
      fontWeight: theme.typography.fontWeights.bold,
    },
  };
});

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // =============================================
  // ONBOARDING STEPS DATA
  // =============================================

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('onboarding.mainScreen.welcome.title', 'Willkommen bei ReactNative Skeleton!'),
      description: t('onboarding.mainScreen.welcome.description', 'Die moderne Enterprise-App mit Clean Architecture und TypeScript.'),
      icon: '🚀',
      color: '#667eea',
      features: [
        t('onboarding.mainScreen.welcome.feature1', 'Clean Architecture Design'),
        t('onboarding.mainScreen.welcome.feature2', 'Enterprise-grade Security'),
        t('onboarding.mainScreen.welcome.feature3', 'Performance Optimized'),
      ],
    },
    {
      id: 'profile',
      title: t('onboarding.mainScreen.profile.title', 'Dein Profil verwalten'),
      description: t('onboarding.mainScreen.profile.description', 'Erstelle und verwalte dein persönliches Profil mit erweiterten Funktionen.'),
      icon: '👤',
      color: '#764ba2',
      features: [
        t('onboarding.mainScreen.profile.feature1', 'Avatar Upload & Bearbeitung'),
        t('onboarding.mainScreen.profile.feature2', 'Privacy Settings'),
        t('onboarding.mainScreen.profile.feature3', 'Vollständigkeit Tracking'),
      ],
    },
    {
      id: 'notifications',
      title: t('onboarding.mainScreen.notifications.title', 'Smart Notifications'),
      description: t('onboarding.mainScreen.notifications.description', 'Erhalte wichtige Updates und behalte die Kontrolle über deine Benachrichtigungen.'),
      icon: '🔔',
      color: '#667eea',
      features: [
        t('onboarding.mainScreen.notifications.feature1', 'Real-time Updates'),
        t('onboarding.mainScreen.notifications.feature2', 'Kategorisierte Nachrichten'),
        t('onboarding.mainScreen.notifications.feature3', 'Granulare Kontrolle'),
      ],
    },
    {
      id: 'security',
      title: t('onboarding.mainScreen.security.title', 'Enterprise Security'),
      description: t('onboarding.mainScreen.security.description', 'Deine Daten sind sicher mit modernsten Sicherheitsstandards.'),
      icon: '🔐',
      color: '#f093fb',
      features: [
        t('onboarding.mainScreen.security.feature1', 'XSS & Injection Schutz'),
        t('onboarding.mainScreen.security.feature2', 'Encrypted Storage'),
        t('onboarding.mainScreen.security.feature3', 'Biometric Auth'),
      ],
    },
    {
      id: 'ready',
      title: t('onboarding.mainScreen.ready.title', 'Bereit zum Start!'),
      description: t('onboarding.mainScreen.ready.description', 'Du bist bereit, alle Features der App zu entdecken. Viel Spaß!'),
      icon: '🎉',
      color: '#a8edea',
      features: [
        t('onboarding.mainScreen.ready.feature1', 'Alle Features verfügbar'),
        t('onboarding.mainScreen.ready.feature2', 'Demo-Daten zum Testen'),
        t('onboarding.mainScreen.ready.feature3', 'Vollständige Clean Architecture'),
      ],
    },
  ];

  // =============================================
  // HANDLERS
  // =============================================

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    // Track onboarding progress
    errorMonitoring.trackEvent('onboarding.page_viewed', {
      page,
      stepId: onboardingSteps[page]?.id,
      progress: ((page + 1) / onboardingSteps.length) * 100,
    });

    // Animate slide indicator
    Animated.spring(slideAnim, {
      toValue: page,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [onboardingSteps, slideAnim]);

  const goToNext = useCallback(() => {
    if (currentPage < onboardingSteps.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      // Completed onboarding
      errorMonitoring.trackEvent('onboarding.completed', {
        totalSteps: onboardingSteps.length,
        completionTime: Date.now(),
      });
      
      // Animate out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }
  }, [currentPage, onboardingSteps.length, fadeAnim, onComplete]);

  const goToPrevious = useCallback(() => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    }
  }, [currentPage]);

  const skipOnboarding = useCallback(() => {
    errorMonitoring.trackEvent('onboarding.skipped', {
      skippedAtStep: currentPage,
      progress: ((currentPage + 1) / onboardingSteps.length) * 100,
    });
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  }, [currentPage, onboardingSteps.length, fadeAnim, onComplete]);

  // =============================================
  // RENDER FUNCTIONS
  // =============================================

  const renderStep = (step: OnboardingStep, _index: number) => (
    <View key={step.id} style={[styles.stepContainer, { backgroundColor: step.color }]}>
      <View style={styles.stepContent}>
        {/* Icon */}
        <Text style={styles.stepIcon}>{step.icon}</Text>
        
        {/* Title */}
        <Text style={styles.stepTitle}>{step.title}</Text>
        
        {/* Description */}
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        {/* Features List */}
        <View style={styles.featuresContainer}>
          {step.features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPageIndicator = () => (
    <View style={styles.indicatorContainer}>
      {onboardingSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            currentPage === index && styles.activeIndicator,
          ]}
        />
      ))}
    </View>
  );

  // =============================================
  // MAIN RENDER
  // =============================================

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        {currentPage < onboardingSteps.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
            <Text style={styles.skipText}>
              {t('onboarding.mainScreen.skip', 'Überspringen')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Pager View */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        >
          {onboardingSteps.map((step, _index) => renderStep(step, _index))}
        </PagerView>

        {/* Page Indicator */}
        {renderPageIndicator()}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentPage > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={goToPrevious}>
              <Text style={styles.backButtonText}>
                {t('back', 'Zurück')}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.spacer} />
          
          <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
            <Text style={styles.nextButtonText}>
              {currentPage === onboardingSteps.length - 1
                ? t('getStarted', 'Los geht\'s!')
                : t('next', 'Weiter')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}; 