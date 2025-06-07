import {useEffect, useRef} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '@features/auth/presentation/hooks/use-auth';
import type {RootStackParamList} from '@core/navigation/navigation.types';

export function useGuestGuard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const hasRedirected = useRef(false);

  // Log auth state changes
  useEffect(() => {
    console.log(
      '[useGuestGuard] AUTH STATE CHANGE:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', isLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    console.log(
      '[useGuestGuard] NAVIGATION EFFECT:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', isLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
    
    if (isAuthenticated && !isLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('[useGuestGuard] REDIRECTING to Main → HomeTab');
      
      // Use setTimeout to ensure navigation stack is ready
      setTimeout(() => {
        console.log('[useGuestGuard] EXECUTING navigation.dispatch');
        try {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Main', params: {screen: 'HomeTab'}}],
            })
          );
          console.log('[useGuestGuard] Navigation dispatch SUCCESSFUL');
        } catch (error) {
          console.error('[useGuestGuard] Navigation dispatch FAILED:', error);
        }
      }, 100);
    }
    
    // Reset redirect flag when user logs out
    if (!isAuthenticated && !isLoading) {
      console.log('[useGuestGuard] Resetting hasRedirected flag');
      hasRedirected.current = false;
    }
  }, [isAuthenticated, isLoading, user, navigation]);
}
