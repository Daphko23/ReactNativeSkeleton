import {useEffect, useRef} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuthStore} from '@features/auth/presentation/store/auth.store';
import type {RootStackParamList} from '@core/navigation/navigation.types';

export function useAuthGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const didRedirect = useRef(false);

  useEffect(() => {
    console.log(
      '[useAuthGuard] isAuthenticated:',
      isAuthenticated,
      'didRedirect:',
      didRedirect.current
    );
    if (!isAuthenticated && !didRedirect.current) {
      didRedirect.current = true;
      console.log('[useAuthGuard] redirecting to Auth → Login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Auth', params: {screen: 'Login'}}],
        })
      );
    }
  }, [isAuthenticated, navigation]);
} 