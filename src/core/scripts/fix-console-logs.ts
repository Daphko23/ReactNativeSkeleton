/**
 * @fileoverview CONSOLE-LOG-FIXER: Automated Console.log Replacement Script
 * @description Utility script to replace all console.log calls with structured enterprise logging
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Scripts.FixConsoleLogs
 * @namespace Core.Scripts.FixConsoleLogs
 * @category Scripts
 * @subcategory Logging
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Console.log replacement mappings for Auth Repository
 */
const authRepositoryReplacements = [
  {
    search: /console\.error\('\[AuthRepository\] Verify MFA error:', error\);/g,
    replace: `this.logger.error('Verify MFA error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'mfa-verification-error' }
    }, error instanceof Error ? error : new Error('Unknown MFA verification error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Get MFA factors error:', error\);/g,
    replace: `this.logger.error('Get MFA factors error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'mfa-factors-error' }
    }, error instanceof Error ? error : new Error('Unknown MFA factors error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Disable MFA error:', error\);/g,
    replace: `this.logger.error('Disable MFA error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'mfa-disable-error' }
    }, error instanceof Error ? error : new Error('Unknown MFA disable error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Create MFA challenge error:', error\);/g,
    replace: `this.logger.error('Create MFA challenge error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'mfa-challenge-error' }
    }, error instanceof Error ? error : new Error('Unknown MFA challenge error'));`
  },
  {
    search: /console\.log\(\s*'Biometric authentication successful for user:',\s*user\.id\s*\);/g,
    replace: `this.logger.info('Biometric authentication successful', LogCategory.SECURITY, {
      service: 'AuthRepository',
      userId: user.id,
      metadata: { operation: 'biometric-auth-success' }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Biometric authentication error:', error\);/g,
    replace: `this.logger.error('Biometric authentication error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'biometric-auth-error' }
    }, error instanceof Error ? error : new Error('Unknown biometric authentication error'));`
  },
  {
    search: /console\.log\(\s*'Disabling biometric authentication for user:',\s*user\.id\s*\);/g,
    replace: `this.logger.info('Disabling biometric authentication', LogCategory.SECURITY, {
      service: 'AuthRepository',
      userId: user.id,
      metadata: { operation: 'biometric-disable' }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Disable biometric error:', error\);/g,
    replace: `this.logger.error('Disable biometric error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'biometric-disable-error' }
    }, error instanceof Error ? error : new Error('Unknown biometric disable error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Google OAuth error:', error\);/g,
    replace: `this.logger.error('Google OAuth error', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'oauth-google-error', provider: 'google' }
    }, error instanceof Error ? error : new Error('Unknown Google OAuth error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Apple OAuth error:', error\);/g,
    replace: `this.logger.error('Apple OAuth error', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'oauth-apple-error', provider: 'apple' }
    }, error instanceof Error ? error : new Error('Unknown Apple OAuth error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Microsoft OAuth error:', error\);/g,
    replace: `this.logger.error('Microsoft OAuth error', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'oauth-microsoft-error', provider: 'microsoft' }
    }, error instanceof Error ? error : new Error('Unknown Microsoft OAuth error'));`
  },
  {
    search: /console\.log\(\s*`Linking \$\{provider\} OAuth provider for user: \$\{user\.id\}`\s*\);/g,
    replace: `this.logger.info('Linking OAuth provider', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      userId: user.id,
      metadata: { operation: 'oauth-link', provider }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Link OAuth provider error:', error\);/g,
    replace: `this.logger.error('Link OAuth provider error', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'oauth-link-error' }
    }, error instanceof Error ? error : new Error('Unknown OAuth link error'));`
  },
  {
    search: /console\.log\(\s*`Unlinking \$\{provider\} OAuth provider for user: \$\{user\.id\}`\s*\);/g,
    replace: `this.logger.info('Unlinking OAuth provider', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      userId: user.id,
      metadata: { operation: 'oauth-unlink', provider }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Unlink OAuth provider error:', error\);/g,
    replace: `this.logger.error('Unlink OAuth provider error', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'oauth-unlink-error' }
    }, error instanceof Error ? error : new Error('Unknown OAuth unlink error'));`
  },
  {
    search: /console\.log\(`Assigning role \$\{role\} to user \$\{userId\}`\);/g,
    replace: `this.logger.info('Assigning role to user', LogCategory.AUTHORIZATION, {
      service: 'AuthRepository',
      userId,
      metadata: { operation: 'role-assign', role }
    });`
  },
  {
    search: /console\.log\(`Removing role \$\{role\} from user \$\{userId\}`\);/g,
    replace: `this.logger.info('Removing role from user', LogCategory.AUTHORIZATION, {
      service: 'AuthRepository',
      userId,
      metadata: { operation: 'role-remove', role }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Get active sessions error:', error\);/g,
    replace: `this.logger.error('Get active sessions error', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'sessions-get-error' }
    }, error instanceof Error ? error : new Error('Unknown get sessions error'));`
  },
  {
    search: /console\.warn\('Terminating other sessions not implemented yet'\);/g,
    replace: `this.logger.warn('Terminating other sessions not implemented yet', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'sessions-terminate-not-implemented' }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Terminate session error:', error\);/g,
    replace: `this.logger.error('Terminate session error', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'session-terminate-error' }
    }, error instanceof Error ? error : new Error('Unknown session terminate error'));`
  },
  {
    search: /console\.warn\('Terminate all other sessions not fully implemented yet'\);/g,
    replace: `this.logger.warn('Terminate all other sessions not fully implemented yet', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'sessions-terminate-all-not-implemented' }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Terminate all sessions error:', error\);/g,
    replace: `this.logger.error('Terminate all sessions error', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'sessions-terminate-all-error' }
    }, error instanceof Error ? error : new Error('Unknown terminate all sessions error'));`
  },
  {
    search: /console\.log\('Refreshing session'\);/g,
    replace: `this.logger.info('Refreshing session', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'session-refresh' }
    });`
  },
  {
    search: /console\.error\('\[AuthRepository\] Set session timeout error:', error\);/g,
    replace: `this.logger.error('Set session timeout error', LogCategory.SESSION, {
      service: 'AuthRepository',
      metadata: { operation: 'session-timeout-error' }
    }, error instanceof Error ? error : new Error('Unknown session timeout error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Log security event error:', error\);/g,
    replace: `this.logger.error('Log security event error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'security-event-log-error' }
    }, error instanceof Error ? error : new Error('Unknown security event log error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Check suspicious activity error:', error\);/g,
    replace: `this.logger.error('Check suspicious activity error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'suspicious-activity-check-error' }
    }, error instanceof Error ? error : new Error('Unknown suspicious activity check error'));`
  },
  {
    search: /console\.error\('\[AuthRepository\] Get security events error:', error\);/g,
    replace: `this.logger.error('Get security events error', LogCategory.SECURITY, {
      service: 'AuthRepository',
      metadata: { operation: 'security-events-get-error' }
    }, error instanceof Error ? error : new Error('Unknown get security events error'));`
  },
  {
    search: /console\.log\(`Enabling SSO for provider: \$\{provider\}`, config\);/g,
    replace: `this.logger.info('Enabling SSO for provider', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'sso-enable', provider, config }
    });`
  },
  {
    search: /console\.log\('Syncing with LDAP', config\);/g,
    replace: `this.logger.info('Syncing with LDAP', LogCategory.AUTHENTICATION, {
      service: 'AuthRepository',
      metadata: { operation: 'ldap-sync', config }
    });`
  }
];

/**
 * Apply console.log replacements to a file
 */
function fixConsoleLogsInFile(filePath: string, replacements: Array<{search: RegExp, replace: string}>): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed console.log calls in: ${filePath}`);
    } else {
      console.log(`ℹ️  No console.log calls to fix in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
  }
}

/**
 * Main execution function
 */
function main() {
  const authRepositoryPath = path.join(__dirname, '../../features/auth/data/repository/auth.repository.impl.ts');
  
  console.log('🔧 Starting console.log replacement in Auth Repository...');
  fixConsoleLogsInFile(authRepositoryPath, authRepositoryReplacements);
  console.log('✅ Console.log replacement completed!');
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { fixConsoleLogsInFile, authRepositoryReplacements }; 