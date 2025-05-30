/**
 * @file Wiederverwendbare Komponente für einen Formularabschnitt.
 */

import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './form-section.styles';

interface FormSectionProps {
  /** Titel des Abschnitts */
  title: string;
  /** Kinder-Komponenten */
  children: React.ReactNode;
  /** Test ID für Komponententests */
  testID?: string;
}

/**
 * Wiederverwendbare Komponente für einen Formularabschnitt.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};
