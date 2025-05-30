export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));

export const useRoute = jest.fn(() => ({
  params: {},
}));

export const createNavigatorFactory = jest.fn(() => jest.fn());

export const NavigationContainer = ({children}: {children: React.ReactNode}) =>
  children;
