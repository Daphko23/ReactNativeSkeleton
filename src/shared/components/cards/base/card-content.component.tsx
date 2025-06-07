/**
 * CardContent Component - Enterprise Content Wrapper
 * Simple wrapper component for card content with consistent spacing
 */

import React from 'react';
import { View } from 'react-native';
import type { CardContentProps } from '../types/card.types';

/**
 * @component CardContent
 * @description Simple wrapper for card content with consistent spacing
 * 
 * @param {CardContentProps} props - Component props
 * @returns {React.ReactElement} Card content wrapper
 * 
 * @example
 * ```tsx
 * <CardContent>
 *   <Text>Your content here</Text>
 * </CardContent>
 * ```
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  style
}) => {
  return (
    <View style={style}>
      {children}
    </View>
  );
};

export default CardContent; 