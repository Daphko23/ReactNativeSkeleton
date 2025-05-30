import React from 'react';
import {useAuthGuard} from '@shared/hooks/use-auth.guard';

/**
 * Wraps an authenticated-only screen to redirect non-logged-in users to AuthNavigator.
 *
 * @param Component - the auth-required screen (e.g. SecuritySettings, Profile)
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useAuthGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
}; 