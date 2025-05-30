import {JSX} from 'react';

export const MD3LightTheme = {
  colors: {
    primary: '#000000',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    error: '#FF0000',
    onPrimary: '#FFFFFF',
    onSurface: '#000000',
    outline: '#CCCCCC',
  },
};

// Alias für bessere Kompatibilität
export const DefaultTheme = MD3LightTheme;

export const configureFonts = jest.fn(options => options.config);

export const PaperProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return React.createElement(
    'View',
    {testID: 'paper-provider'},
    props.children
  );
};
