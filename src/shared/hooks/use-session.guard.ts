import {useEffect} from 'react';
import {useAuth} from '@features/auth/presentation/hooks/use-auth';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@core/navigation/navigation.types';

/**
 * Hook to protect screens that require authentication.
 * Redirects unauthenticated users to the Login screen.
 *
 * Should be used at the top of protected screens (e.g. ProfileScreen).
 */
export const useSessionGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);
};
