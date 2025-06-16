/**
 * @fileoverview Essential React Native Mocks for Testing
 * 
 * @description Minimal React Native module mocks for Jest testing environment.
 * Only includes essential mocks to avoid module resolution issues.
 * 
 * @module ReactNativeMocks
 * @since 2.0.0 (Simplified Enterprise Testing Setup)
 * @author ReactNativeSkeleton Enterprise Team
 */

// Import gesture handler setup conditionally to avoid parsing errors
try {
  require('react-native-gesture-handler/jestSetup');
} catch {
  // Gesture handler not available in test environment
}

// =============================================================================
// REACT NATIVE CORE MOCKS
// =============================================================================

// Dimensions Mock
jest.mock('react-native', () => {
  // Don't use requireActual to avoid ES6 module issues
  return {
    // Basic Components
    View: 'View',
    Text: 'Text',
    ScrollView: 'ScrollView',
    TouchableOpacity: 'TouchableOpacity',
    TouchableHighlight: 'TouchableHighlight',
    TouchableWithoutFeedback: 'TouchableWithoutFeedback',
    TextInput: 'TextInput',
    Image: 'Image',
    FlatList: 'FlatList',
    SectionList: 'SectionList',
    SafeAreaView: 'SafeAreaView',
    StatusBar: 'StatusBar',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    ActivityIndicator: 'ActivityIndicator',
    Modal: 'Modal',
    Alert: {
      alert: jest.fn(),
    },
    Animated: {
      View: 'View',
      Text: 'Text',
      ScrollView: 'ScrollView',
      Image: 'Image',
      createAnimatedComponent: jest.fn().mockImplementation((Component) => Component),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn(),
      })),
      parallel: jest.fn(() => ({
        start: jest.fn(),
      })),
      loop: jest.fn(() => ({
        start: jest.fn(),
      })),
      Value: jest.fn().mockImplementation(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(),
      })),
      ValueXY: jest.fn().mockImplementation(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(),
      })),
    },
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      inOut: jest.fn(),
      out: jest.fn(),
      in: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn().mockImplementation((styles) => styles),
      flatten: jest.fn().mockImplementation((style) => style),
      absoluteFill: {},
      absoluteFillObject: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    Dimensions: {
      get: jest.fn().mockReturnValue({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 1,
      }),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    PixelRatio: {
      get: jest.fn().mockReturnValue(2),
      getFontScale: jest.fn().mockReturnValue(1),
      getPixelSizeForLayoutSize: jest.fn().mockImplementation((size) => size * 2),
      roundToNearestPixel: jest.fn().mockImplementation((size) => size),
    },
    Platform: {
      OS: 'ios',
      Version: '14.0',
      select: jest.fn().mockImplementation((obj) => obj.ios || obj.default),
    },
    NativeModules: {
      StatusBarManager: {
        HEIGHT: 20,
      },
      PlatformConstants: {
        forceTouchAvailable: false,
      },
    },
  };
});

// =============================================================================
// REACT NATIVE GESTURE HANDLER MOCK
// =============================================================================

jest.mock('react-native-gesture-handler', () => ({
  Swipeable: 'View',
  DrawerLayout: 'View',
  State: {},
  ScrollView: 'ScrollView',
  Slider: 'View',
  Switch: 'Switch',
  TextInput: 'TextInput',
  ToolbarAndroid: 'View',
  ViewPagerAndroid: 'View',
  DrawerLayoutAndroid: 'View',
  WebView: 'View',
  NativeViewGestureHandler: 'View',
  TapGestureHandler: 'View',
  FlingGestureHandler: 'View',
  ForceTouchGestureHandler: 'View',
  LongPressGestureHandler: 'View',
  PanGestureHandler: 'View',
  PinchGestureHandler: 'View',
  RotationGestureHandler: 'View',
  RawButton: 'View',
  BaseButton: 'View',
  RectButton: 'View',
  BorderlessButton: 'View',
  FlatList: 'FlatList',
  gestureHandlerRootHOC: jest.fn(),
  Directions: {},
}));

// =============================================================================
// ASYNC STORAGE MOCK
// =============================================================================

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(null),
  multiRemove: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
  getAllKeys: jest.fn().mockResolvedValue([]),
}));

// =============================================================================
// REACT NATIVE VECTOR ICONS MOCK
// =============================================================================

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

// =============================================================================
// REACT NAVIGATION MOCK
// =============================================================================

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
  NavigationContainer: ({ children }: any) => children,
}));

// =============================================================================
// REACT NATIVE REANIMATED MOCK
// =============================================================================

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// =============================================================================
// REACT I18NEXT MOCK
// =============================================================================

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// =============================================================================
// GLOBAL TEST ENVIRONMENT SETUP
// =============================================================================

// Polyfills
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  statusText: 'OK',
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  headers: new Map(),
});

// Global test utilities
global.requestAnimationFrame = (callback: any) => {
  setTimeout(callback, 0);
  return 1; // Mock frame ID
};

global.cancelAnimationFrame = (id: any) => {
  clearTimeout(id);
};

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || 
     args[0].includes('deprecated') ||
     args[0].includes('loose'))
  ) {
    return;
  }
  originalWarn(...args);
};

console.log('🚀 Essential React Native Mocks loaded successfully'); 