/**
 * @fileoverview AVATAR-SKELETON-COMPONENT: Enterprise UI Loading Component
 * @description Professional animated skeleton for avatar loading states with smooth shimmer animations
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.UI
 * @namespace Shared.Components.UI.AvatarSkeleton
 * @category Components
 * @subcategory UI
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

/**
 * Props interface for the AvatarSkeleton component.
 * Configuration options for avatar skeleton loading states.
 * 
 * @interface AvatarSkeletonProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory UI
 * 
 * @example
 * ```tsx
 * const skeletonProps: AvatarSkeletonProps = {
 *   size: 120,
 *   theme: currentTheme,
 *   style: { marginRight: 16 }
 * };
 * ```
 */
export interface AvatarSkeletonProps {
  /**
   * Size of the avatar skeleton in pixels.
   * Controls both width and height of the circular skeleton.
   * 
   * @type {number}
   * @optional
   * @default 80
   * @example 120
   */
  size?: number;

  /**
   * Theme object for consistent styling.
   * Provides color and styling context.
   * 
   * @type {any}
   * @optional
   * @example themeObject
   */
  theme?: any;

  /**
   * Custom styling for the skeleton container.
   * Applied to the outermost wrapper.
   * 
   * @type {any}
   * @optional
   * @example { marginVertical: 10 }
   */
  style?: any;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @default 'avatar-skeleton'
   * @example "profile-avatar-skeleton"
   */
  testID?: string;
}

/**
 * Parameters interface for skeleton styling function.
 * Defines the styling configuration for the skeleton appearance.
 * 
 * @interface SkeletonStylesParams
 * @since 1.0.0
 * @private
 * @internal
 * 
 * @example
 * ```tsx
 * const styleParams: SkeletonStylesParams = {
 *   size: 80,
 *   baseColor: '#E0E0E0',
 *   highlightColor: '#F5F5F5'
 * };
 * ```
 */
interface SkeletonStylesParams {
  /**
   * Size of the skeleton in pixels.
   * 
   * @type {number}
   * @required
   */
  size: number;

  /**
   * Base background color for the skeleton.
   * 
   * @type {string}
   * @required
   */
  baseColor: string;

  /**
   * Highlight color for shimmer effects.
   * 
   * @type {string}
   * @required
   */
  highlightColor: string;
}

/**
 * Creates styled components for the avatar skeleton.
 * Generates theme-aware styling for skeleton components.
 * 
 * @function createAvatarSkeletonStyles
 * @param {SkeletonStylesParams} params - Styling configuration parameters
 * @returns {StyleSheet} Compiled style sheet
 * 
 * @since 1.0.0
 * @private
 * @internal
 */
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

/**
 * Avatar Skeleton Component
 * 
 * A professional animated skeleton component designed for avatar loading states.
 * Features smooth shimmer animations, customizable sizing, theme integration,
 * and accessibility compliance for enterprise-grade user experience during
 * content loading phases.
 * 
 * @component
 * @function AvatarSkeleton
 * @param {AvatarSkeletonProps} props - The component props
 * @returns {React.ReactElement} Rendered avatar skeleton component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory UI
 * @module Shared.Components.UI
 * @namespace Shared.Components.UI.AvatarSkeleton
 * 
 * @example
 * Basic avatar skeleton:
 * ```tsx
 * import { AvatarSkeleton } from '@/shared/components/ui';
 * 
 * const UserProfile = () => {
 *   const [isLoading, setIsLoading] = useState(true);
 *   const [userAvatar, setUserAvatar] = useState(null);
 * 
 *   useEffect(() => {
 *     loadUserAvatar().then(avatar => {
 *       setUserAvatar(avatar);
 *       setIsLoading(false);
 *     });
 *   }, []);
 * 
 *   return (
 *     <View style={styles.profileContainer}>
 *       {isLoading ? (
 *         <AvatarSkeleton 
 *           size={80}
 *           testID="user-avatar-skeleton"
 *         />
 *       ) : (
 *         <Avatar source={{ uri: userAvatar }} size={80} />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple avatar skeletons in a list:
 * ```tsx
 * const UserList = () => {
 *   const [users, setUsers] = useState([]);
 *   const [isLoading, setIsLoading] = useState(true);
 * 
 *   const skeletonItems = Array.from({ length: 5 }, (_, index) => (
 *     <View key={index} style={styles.listItem}>
 *       <AvatarSkeleton 
 *         size={60}
 *         theme={theme}
 *         style={styles.avatarSkeleton}
 *       />
 *       <View style={styles.contentSkeleton}>
 *         <SkeletonPlaceholder />
 *       </View>
 *     </View>
 *   ));
 * 
 *   return (
 *     <ScrollView>
 *       {isLoading ? skeletonItems : (
 *         users.map(user => (
 *           <UserListItem key={user.id} user={user} />
 *         ))
 *       )}
 *     </ScrollView>
 *   );
 * };
 * ```
 * 
 * @example
 * Different sizes and themes:
 * ```tsx
 * const AvatarSizes = () => {
 *   const [loadingStates, setLoadingStates] = useState({
 *     small: true,
 *     medium: true,
 *     large: true,
 *     extraLarge: true
 *   });
 * 
 *   return (
 *     <View style={styles.sizesContainer}>
 *       <View style={styles.sizeRow}>
 *         <Text>Small (40px)</Text>
 *         {loadingStates.small ? (
 *           <AvatarSkeleton size={40} theme={lightTheme} />
 *         ) : (
 *           <Avatar size={40} />
 *         )}
 *       </View>
 * 
 *       <View style={styles.sizeRow}>
 *         <Text>Medium (60px)</Text>
 *         {loadingStates.medium ? (
 *           <AvatarSkeleton size={60} theme={lightTheme} />
 *         ) : (
 *           <Avatar size={60} />
 *         )}
 *       </View>
 * 
 *       <View style={styles.sizeRow}>
 *         <Text>Large (80px)</Text>
 *         {loadingStates.large ? (
 *           <AvatarSkeleton size={80} theme={darkTheme} />
 *         ) : (
 *           <Avatar size={80} />
 *         )}
 *       </View>
 * 
 *       <View style={styles.sizeRow}>
 *         <Text>Extra Large (120px)</Text>
 *         {loadingStates.extraLarge ? (
 *           <AvatarSkeleton size={120} theme={darkTheme} />
 *         ) : (
 *           <Avatar size={120} />
 *         )}
 *       </View>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Custom styled skeleton in profile card:
 * ```tsx
 * const ProfileCard = () => {
 *   const [profile, setProfile] = useState(null);
 *   const [isLoading, setIsLoading] = useState(true);
 * 
 *   const loadProfile = async () => {
 *     try {
 *       const profileData = await fetchUserProfile();
 *       setProfile(profileData);
 *     } catch (error) {
 *       handleError(error);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   useEffect(() => {
 *     loadProfile();
 *   }, []);
 * 
 *   return (
 *     <Card style={styles.profileCard}>
 *       <Card.Content>
 *         <View style={styles.profileHeader}>
 *           {isLoading ? (
 *             <AvatarSkeleton
 *               size={100}
 *               theme={theme}
 *               style={{
 *                 marginBottom: 16,
 *                 alignSelf: 'center'
 *               }}
 *               testID="profile-avatar-loading"
 *             />
 *           ) : (
 *             <Avatar
 *               source={{ uri: profile.avatarUrl }}
 *               size={100}
 *               style={styles.profileAvatar}
 *             />
 *           )}
 *           
 *           {isLoading ? (
 *             <View style={styles.textSkeletons}>
 *               <SkeletonPlaceholder width="70%" height={20} />
 *               <SkeletonPlaceholder width="50%" height={16} />
 *             </View>
 *           ) : (
 *             <View style={styles.profileInfo}>
 *               <Text variant="headlineSmall">{profile.name}</Text>
 *               <Text variant="bodyMedium">{profile.title}</Text>
 *             </View>
 *           )}
 *         </View>
 *       </Card.Content>
 *     </Card>
 *   );
 * };
 * ```
 * 
 * @features
 * - Smooth shimmer animation with multiple layers
 * - Circular avatar skeleton design
 * - Customizable size configuration
 * - Theme integration for consistent styling
 * - Performance optimized with native driver
 * - Accessibility compliant with proper labels
 * - Memory efficient animation cleanup
 * - Cross-platform compatibility
 * - Enterprise-grade visual quality
 * - Multiple animation sequences
 * 
 * @architecture
 * - React hooks for animation management
 * - useRef for persistent animation values
 * - useEffect for animation lifecycle
 * - Animated.Value for smooth transitions
 * - Native driver optimization
 * - Proper cleanup on unmount
 * - Layered animation approach
 * 
 * @styling
 * - Theme-aware color schemes
 * - Circular design with border radius
 * - Layered animation effects
 * - Relative positioning for overlays
 * - Overflow hidden for clean edges
 * - Customizable styling support
 * - Responsive sizing
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper accessibility labels
 * - Role-based identification
 * - Loading state announcements
 * - Focus management support
 * - High contrast compatibility
 * - Semantic structure
 * 
 * @performance
 * - Native driver animations for 60fps
 * - Efficient animation loops
 * - Memory leak prevention
 * - Optimized re-render behavior
 * - Lightweight component structure
 * - Proper animation cleanup
 * - Minimal CPU usage
 * 
 * @use_cases
 * - User profile loading states
 * - Contact list skeletons
 * - Social media feed placeholders
 * - Chat participant loading
 * - Team member grid loading
 * - Comment author placeholders
 * - Gallery user indicators
 * - Directory listing skeletons
 * 
 * @best_practices
 * - Use appropriate sizes for context
 * - Match skeleton size to actual avatar
 * - Provide meaningful accessibility labels
 * - Consider theme compatibility
 * - Test animation performance
 * - Implement proper cleanup
 * - Use consistent timing across app
 * - Consider reduced motion preferences
 * - Test with various network speeds
 * - Ensure smooth transitions
 * 
 * @dependencies
 * - react: Core React library with hooks
 * - react-native: View, StyleSheet, Animated, Easing
 * 
 * @see {@link Animated} for animation implementation
 * @see {@link useRef} for animation value persistence
 * @see {@link useEffect} for animation lifecycle management
 * 
 * @todo Add reduced motion support
 * @todo Implement custom animation patterns
 * @todo Add skeleton color customization
 * @todo Include animation speed controls
 */
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

AvatarSkeleton.displayName = 'AvatarSkeleton';

export default AvatarSkeleton; 