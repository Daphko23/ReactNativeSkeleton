/**
 * React Native Skeleton App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Polyfills für React Native und Supabase - MÜSSEN VOR ALLEN ANDEREN IMPORTS STEHEN
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Global Immer Configuration - MUST be loaded before any stores
import './src/core/config/immer-config';

// Globale Buffer Polyfill
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Process Polyfill
import process from 'process';
global.process = process;

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
