/**
 * BaseCard Component - Enterprise Foundation
 * Foundational card component with consistent styling and behavior
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';

import { createCardStyles, createCardVariantStyles, createCardSizeStyles } from '../utils/card-styles.util';

export interface BaseCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  elevation?: number;
  style?: ViewStyle;
  theme?: any;
  testID?: string;
  onPress?: () => void;
}

/**
 * @component BaseCard
 * @description Foundational card component providing consistent styling and behavior
 * 
 * @param {BaseCardProps} props - Component props
 * @returns {React.ReactElement} Base card component
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  elevation,
  style,
  theme,
  testID,
  onPress,
  ...props
}) => {
  const baseStyles = createCardStyles(theme);
  const variantStyles = variant !== 'default' ? createCardVariantStyles(theme, variant) : baseStyles;
  const sizeStyles = size !== 'medium' ? createCardSizeStyles(theme, size) : variantStyles;
  
  const cardStyle = [
    sizeStyles.container,
    style
  ];

  const CardComponent = onPress ? Card : View;

  return (
    <CardComponent
      style={cardStyle}
      elevation={elevation as any}
      onPress={onPress}
      testID={testID}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default BaseCard; 