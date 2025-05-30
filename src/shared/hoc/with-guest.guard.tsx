import React from 'react';
import {useGuestGuard} from '@shared/hooks/use-guest.guard';

/**
 * Wraps a guest-only screen to redirect logged-in users to MainNavigator.
 *
 * @param Component - the guest-accessible screen (e.g. Login, Register)
 */
export const withGuestGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useGuestGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withGuestGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
};
