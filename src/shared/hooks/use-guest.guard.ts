import {useEffect, useRef} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuthStore} from '@features/auth/presentation/store/auth.store';
import type {RootStackParamList} from '@core/navigation/navigation.types';

export function useGuestGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const didRedirect = useRef(false);

  useEffect(() => {
    console.log(
      '[useGuestGuard] isAuthenticated:',
      isAuthenticated,
      'didRedirect:',
      didRedirect.current
    );
    if (isAuthenticated && !didRedirect.current) {
      didRedirect.current = true;
      console.log('[useGuestGuard] redirecting to Main → MatchdayTab');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main', params: {screen: 'MatchdayTab'}}],
        })
      );
    }
  }, [isAuthenticated, navigation]);
}
