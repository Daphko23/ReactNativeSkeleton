import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {colors} from '@core/theme';

/**
 * Props für ErrorBoundary-Komponente.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * State für ErrorBoundary, speichert Fehler und ErrorInfo.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Ein globaler ErrorBoundary für die gesamte App.
 * Fängt JavaScript-Fehler in React-Komponenten ab und zeigt ein Fallback-UI.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
    // Hier könnte optional auch Logging/Reporting erfolgen
  }

  handleReload = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Etwas ist schiefgelaufen.</Text>
          <Text style={styles.errorText}>{this.state.error?.message}</Text>
          <Button title="Neu laden" onPress={this.handleReload} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default ErrorBoundary;
