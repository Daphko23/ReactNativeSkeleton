/**
 * AvatarSkeleton Component - Enterprise UI Component
 * Professional animated skeleton for avatar loading states
 * 
 * Features:
 * - Smooth shimmer animation
 * - Circular avatar skeleton
 * - Customizable size
 * - Performance optimized
 * - Accessibility compliant
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export interface AvatarSkeletonProps {
  size?: number;
  theme?: any;
  style?: any;
  testID?: string;
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 80,
  theme,
  style,
  testID = 'avatar-skeleton',
}) => {
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;
  const shimmerAnimatedValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createShimmerAnimation = () => {
      return Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ]);
    };

    const createSecondaryAnimation = () => {
      return Animated.timing(shimmerAnimatedValue2, {
        toValue: 1,
        duration: 1500,
        easing: Easing.sin,
        useNativeDriver: true,
      });
    };

    // Start both animations
    Animated.loop(createShimmerAnimation()).start();
    Animated.loop(createSecondaryAnimation(), { resetBeforeIteration: true }).start();

    return () => {
      shimmerAnimatedValue.stopAnimation();
      shimmerAnimatedValue2.stopAnimation();
    };
  }, [shimmerAnimatedValue, shimmerAnimatedValue2]);

  const shimmerOpacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const shimmerScale = shimmerAnimatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const skeletonBaseColor = theme?.colors?.surfaceVariant || '#E0E0E0';
  const skeletonHighlightColor = theme?.colors?.surface || '#F5F5F5';

  const styles = createAvatarSkeletonStyles({
    size,
    baseColor: skeletonBaseColor,
    highlightColor: skeletonHighlightColor,
  });

  return (
    <View 
      style={[containerStyle, styles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityLabel="Avatar wird geladen"
      accessibilityRole="image"
    >
      {/* Base skeleton */}
      <View style={[styles.baseSkeleton, containerStyle]} />
      
      {/* Animated shimmer layer */}
      <Animated.View
        style={[
          styles.shimmerLayer,
          containerStyle,
          {
            opacity: shimmerOpacity,
            transform: [{ scale: shimmerScale }],
          },
        ]}
      />
      
      {/* Subtle pulse overlay */}
      <Animated.View
        style={[
          styles.pulseOverlay,
          containerStyle,
          {
            opacity: shimmerAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      />
    </View>
  );
};

interface SkeletonStylesParams {
  size: number;
  baseColor: string;
  highlightColor: string;
}

const createAvatarSkeletonStyles = ({ baseColor, highlightColor }: SkeletonStylesParams) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      overflow: 'hidden',
    },
    baseSkeleton: {
      position: 'absolute',
      backgroundColor: baseColor,
    },
    shimmerLayer: {
      position: 'absolute',
      backgroundColor: highlightColor,
    },
    pulseOverlay: {
      position: 'absolute',
      backgroundColor: '#FFFFFF',
    },
  });

AvatarSkeleton.displayName = 'AvatarSkeleton';

export default AvatarSkeleton; 