/**
 * @file Leere-Liste Anzeigekomponente für MatchdayList.
 */

import {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {colors, spacing} from '@core/theme';

interface EmptyListProps {
  /** Gibt an, ob Daten noch geladen werden */
  loading: boolean;
  /** Gibt an, ob aktive Filter vorhanden sind */
  hasActiveFilters: boolean;
  /** Gibt an, ob Suchbegriff gesetzt ist */
  hasSearchTerm: boolean;
}

/**
 * Komponente zur Anzeige von Hinweisen bei leerer Spieltagsliste.
 */
export const EmptyList = memo<EmptyListProps>(
  ({loading, hasActiveFilters, hasSearchTerm}) => {
    const {t} = useTranslation();

    // Nachricht basierend auf Zustand berechnen
    const message = useMemo(() => {
      if (loading) return t('matchdayList.loading');
      if (hasSearchTerm || hasActiveFilters)
        return t('matchdayList.noFilterResults');
      return t('matchdayList.noMatchdays');
    }, [loading, hasActiveFilters, hasSearchTerm, t]);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  text: {
    color: colors.placeholder,
    fontSize: 16,
    textAlign: 'center',
  },
});

EmptyList.displayName = 'EmptyList';
