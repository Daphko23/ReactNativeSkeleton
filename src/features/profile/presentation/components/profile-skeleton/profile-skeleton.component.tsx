/**
 * @fileoverview ProfileSkeleton Component - Loading State UI
 * 
 * @description Professional skeleton loading component for profile screens
 * to provide smooth loading experience without jarring content switches.
 * 
 * @module ProfileSkeletonComponent
 * @since 1.0.0
 */

import React from 'react';
import { View, Animated, Easing } from 'react-native';
import { createProfileSkeletonStyles } from './profile-skeleton.component.styles';

export interface ProfileSkeletonProps {
  theme: any;
  testIds?: any;
}

/**
 * ProfileSkeleton Component
 * 
 * @description Animated skeleton loading component that mimics the actual
 * profile layout to provide seamless loading experience
 */
export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = React.memo(({
  theme,
  testIds,
}) => {
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;
  const styles = React.useMemo(() => createProfileSkeletonStyles(theme), [theme]);

  // Shimmer animation
  React.useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox: React.FC<{ style?: any; children?: React.ReactNode }> = ({ style, children }) => (
    <Animated.View style={[styles.skeletonBox, { opacity: shimmerOpacity }, style]}>
      {children}
    </Animated.View>
  );

  return (
    <View style={styles.container} testID={testIds?.PROFILE_SKELETON}>
      {/* Header Skeleton */}
      <View style={styles.headerSection}>
        <SkeletonBox style={styles.avatar} />
        <View style={styles.headerText}>
          <SkeletonBox style={styles.nameText} />
          <SkeletonBox style={styles.emailText} />
          <SkeletonBox style={styles.completionBar} />
        </View>
      </View>

      {/* Actions Skeleton */}
      <View style={styles.actionsSection}>
        <SkeletonBox style={styles.actionButton} />
        <SkeletonBox style={styles.actionButton} />
      </View>

      {/* Info Sections Skeleton */}
      <View style={styles.infoSection}>
        <SkeletonBox style={styles.sectionTitle} />
        <SkeletonBox style={styles.infoLine} />
        <SkeletonBox style={styles.infoLine} />
        <SkeletonBox style={styles.infoLineShort} />
      </View>

      <View style={styles.infoSection}>
        <SkeletonBox style={styles.sectionTitle} />
        <SkeletonBox style={styles.infoLine} />
        <SkeletonBox style={styles.infoLineShort} />
      </View>

      {/* Navigation Skeleton */}
      <View style={styles.navigationSection}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} style={styles.navigationItem} />
        ))}
      </View>
    </View>
  );
});

ProfileSkeleton.displayName = 'ProfileSkeleton'; 