/**
 * React Native Skeleton App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Polyfills für React Native
import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent(appName, () => App);
