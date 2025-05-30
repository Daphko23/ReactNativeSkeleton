import React from 'react';
import {useSessionGuard} from '@shared/hooks/use-session.guard';

/**
 * Higher-order component to protect screens from unauthenticated access.
 *
 * Wrap any screen that requires authentication with this HOC.
 *
 * Example:
 * export default withSessionGuard(ProfileScreen);
 */
export const withSessionGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useSessionGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withSessionGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
};
