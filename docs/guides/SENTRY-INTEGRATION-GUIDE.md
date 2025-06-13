# 🔍 Sentry Integration Guide - ReactNativeSkeleton Enterprise

## Übersicht

Die ReactNativeSkeleton Enterprise App verfügt über eine vollständig integrierte Sentry-Überwachung für Production-Ready Error Tracking, Performance Monitoring und Enterprise-Grade Logging.

**Ihre Sentry DSN**: `https://bc55d5c46b50aab732295481fbcd8d44@o4509402366410752.ingest.de.sentry.io/4509402377289808`

## 🚀 Automatische Initialisierung

Die Sentry-Integration wird automatisch beim App-Start initialisiert:

```typescript
import { AppInitializer } from '@core/config/app.config';

// In Ihrer App.tsx
useEffect(() => {
  AppInitializer.initialize().catch(console.error);
}, []);
```

## 🏗️ Architektur

### 1. Umgebungsbasierte Konfiguration

- **Development**: Sentry deaktiviert (Console-Logging)
- **Staging**: Sentry aktiviert mit vollem Sampling
- **Production**: Sentry aktiviert mit optimiertem Sampling

### 2. Logger-Factory Integration

```typescript
// Automatische Logger-Erstellung mit Sentry-Integration
const logger = LoggerFactory.createLogger();

// Service-spezifische Logger
const authLogger = LoggerFactory.createServiceLogger('AuthService');
```

### 3. GDPR-Konforme Konfiguration

- **Keine PII-Daten**: Automatische Filterung sensibler Informationen
- **Breadcrumb-Filterung**: Entfernung von Passwörtern und Tokens
- **Datenschutz-Hooks**: beforeSend und beforeBreadcrumb Filter

## 📊 Verfügbare Features

### Error Tracking
```typescript
// Über Logger (Empfohlen)
logger.error('Database connection failed', LogCategory.DATABASE, undefined, error);

// Direkt über Sentry
Sentry.captureException(new Error('Critical error'));
```

### Performance Monitoring
```typescript
// Über Logger (Empfohlen) 
const timer = logger.startTimer('api-call');
// ... Operation ...
timer.stop({ queryCount: 3, responseSize: 1024 });

// Direkt über Sentry
const transaction = Sentry.startTransaction({ name: 'API Call', op: 'http' });
// ... Operation ...
transaction.finish();
```

### User Context Management
```typescript
// Beim Login
updateSentryUser('user-12345', 'premium');

// Beim Logout
clearSentryUser();
```

### Breadcrumbs
```typescript
Sentry.addBreadcrumb({
  message: 'User navigated to profile',
  category: 'navigation',
  level: 'info'
});
```

## 🔧 Konfiguration

### Environment Variables

Erstellen Sie eine `.env` Datei (basierend auf `.env.example`):

```bash
# Sentry-Konfiguration
SENTRY_DSN=https://bc55d5c46b50aab732295481fbcd8d44@o4509402366410752.ingest.de.sentry.io/4509402377289808
NODE_ENV=development
APP_BUILD=2.0.0-dev
```

### Sampling Rates

| Environment | Error Sampling | Traces Sampling | Profiles Sampling |
|-------------|---------------|-----------------|-------------------|
| Development | 100% | 100% | 100% |
| Staging | 100% | 50% | 10% |
| Production | 10% | 1% | 0.1% |
| Test | 0% | 0% | 0% |

## 🧪 Testing der Integration

### 1. Environment Check
```typescript
import { getSentryConfig } from '@core/config/sentry.config';

const config = getSentryConfig();
console.log('Sentry Environment:', config.environment);
console.log('Sentry DSN configured:', !!config.dsn);
```

### 2. Test Error Reporting
```typescript
import { testSentryIntegration } from '@core/config/sentry.config';

// Nur in Development verfügbar
testSentryIntegration();
```

### 3. Logger Integration Test
```typescript
const logger = LoggerFactory.createServiceLogger('TestService');

// Diese Logs erscheinen in Sentry (Production) oder Console (Development)
logger.info('Test message', LogCategory.INFRASTRUCTURE);
logger.error('Test error', LogCategory.INFRASTRUCTURE, undefined, new Error('Test'));
```

## 📈 Monitoring Dashboard

### Sentry Dashboard URL
Ihr Sentry-Projekt: [https://sentry.io/organizations/[YOUR_ORG]/projects/](https://sentry.io)

### Key Metrics
- **Error Rate**: Anzahl der Fehler pro Zeit
- **Performance**: API Response Times, Transaction Durations
- **User Impact**: Betroffene Users und Sessions
- **Release Health**: Crash-freie Sessions pro Release

## 🛡️ Sicherheit & Compliance

### Automatische PII-Filterung
```typescript
// Diese Daten werden automatisch entfernt:
- password, token, apiKey, secret
- Authorization Headers
- X-API-Key Headers
- email, phone, ssn aus Tags
```

### GDPR-Compliance
- **Art. 25**: Data Protection by Design ✅
- **Art. 32**: Security of Processing ✅
- **Audit Trails**: Strukturierte Logging für Compliance

### Security Events
```typescript
logger.logSecurity('Suspicious login attempt', {
  eventType: 'authentication_failure',
  riskLevel: 'high',
  sourceIp: req.ip,
  userAgent: req.get('User-Agent')
});
```

## 📋 Best Practices

### 1. Strukturiertes Logging
```typescript
// ✅ Gut: Strukturiert mit Context
logger.info('User login successful', LogCategory.AUTHENTICATION, {
  userId: 'user-123',
  correlationId: 'login-456',
  metadata: { loginMethod: 'email', duration: 150 }
});

// ❌ Schlecht: Unstrukturiert
console.log('User logged in');
```

### 2. Error Handling
```typescript
// ✅ Gut: Mit Error Object
try {
  await apiCall();
} catch (error) {
  logger.error('API call failed', LogCategory.API, {
    correlationId: generateId(),
    metadata: { endpoint: '/users', method: 'GET' }
  }, error);
}

// ❌ Schlecht: Ohne Context
catch (error) {
  console.error(error);
}
```

### 3. Performance Monitoring
```typescript
// ✅ Gut: Timer verwenden
const timer = logger.startTimer('database-query');
const result = await db.query(sql);
timer.stop({ queryCount: 1, resultCount: result.length });

// ❌ Schlecht: Keine Metriken
await db.query(sql);
```

## 🔍 Debugging

### Development
```typescript
// Sentry ist in Development deaktiviert
// Alle Logs gehen zur Console für sofortiges Debugging
```

### Staging/Production
```typescript
// Sentry ist aktiviert
// Überprüfen Sie Ihr Sentry Dashboard für Errors und Performance
```

### Logger Factory Status
```typescript
import { LoggerFactory } from '@core/logging/logger.factory';

const envInfo = LoggerFactory.getEnvironmentInfo();
console.log('Environment Info:', envInfo);
// Output: { environment: 'development', isDevelopment: true, recommendedLogger: 'console' }
```

## 🚨 Troubleshooting

### 1. Sentry Events erscheinen nicht
- ✅ Überprüfen Sie die DSN-Konfiguration
- ✅ Stellen Sie sicher, dass Sie in Production/Staging Environment sind
- ✅ Überprüfen Sie die Sampling Rate (kann zu niedrig sein)

### 2. Performance Daten fehlen
- ✅ Performance Monitoring ist in Production aktiviert
- ✅ Sampling Rate für Traces überprüfen
- ✅ Transaktionen korrekt gestartet und beendet

### 3. User Context fehlt
- ✅ `updateSentryUser()` nach Login aufrufen
- ✅ `clearSentryUser()` beim Logout aufrufen

## 📞 Support

Bei Fragen zur Sentry-Integration:
1. **Dokumentation**: Diese Anleitung durchlesen
2. **Code-Review**: Logger-Implementierung überprüfen
3. **Sentry Dashboard**: Error-Details und Stack Traces analysieren
4. **Environment**: Korrekte Umgebung (Development vs Production) überprüfen

---

**🎉 Ihre ReactNativeSkeleton App ist jetzt Enterprise-Ready mit vollständiger Sentry-Integration!** 