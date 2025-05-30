import React from 'react';
import {ColorValue} from 'react-native';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

export type ColoredIconProps = {size: number; color: string};
export type SizeOnlyIconProps = {size: number};

// Exakter Icon-Komponententyp (kompatibel mit Ionicons)
export type IconComponentType = React.ComponentType<{
  name: string;
  size?: number;
  color?: string | number | ColorValue;
}>;

/**
 * Für Komponenten wie Button, FAB, TextInput, etc.
 * Erwartet `(props: { size, color }) => ReactElement`
 */
export const makeColoredIcon = (
  Component: IconComponentType,
  name: string
): ((props: ColoredIconProps) => React.ReactElement) => {
  const Icon = function IconComponent({
    size,
    color,
  }: ColoredIconProps): React.ReactElement {
    return <Component name={name} size={size} color={color} />;
  };

  Icon.displayName = `Icon(${name})`;
  return Icon;
};

/**
 * Für Card.Title.right / left
 * Erwartet `(props: { size }) => ReactElement`
 */
export const makeSizeOnlyIcon = (
  Component: IconComponentType,
  name: string
): ((props: SizeOnlyIconProps) => React.ReactElement) => {
  const Icon = function SizeOnlyIconComponent({
    size,
  }: SizeOnlyIconProps): React.ReactElement {
    return <Component name={name} size={size} />;
  };

  Icon.displayName = `Icon(${name}-noColor)`;
  return Icon;
};

/**
 * Für Chips, Menüs etc. → JSX.Element direkt als IconSource
 */
export const makeStaticIcon = (
  Component: IconComponentType,
  name: string,
  size: number = 16,
  color?: string | number | ColorValue
): IconSource => {
  return (<Component name={name} size={size} color={color} />) as IconSource;
};
