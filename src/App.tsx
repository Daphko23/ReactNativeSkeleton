import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {AppTheme, colors} from '@core/theme';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider theme={AppTheme}>
          <NavigationContainer>
            <View style={styles.content}>
              <Text style={styles.title}>React Native Skeleton</Text>
              <Text style={styles.subtitle}>
                Bereit für dein nächstes Projekt!
              </Text>
            </View>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.placeholder,
    fontSize: 16,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default App;
