-- =============================================
-- 🛡️ SECURITY EVENTS TABLE
-- =============================================
-- This table stores all security-related events for audit and monitoring

CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login',
    'logout', 
    'password_change',
    'mfa_enabled',
    'suspicious_activity',
    'biometric_enabled',
    'biometric_disabled',
    'biometric_auth_success',
    'biometric_auth_failed',
    'session_terminated',
    'oauth_linked',
    'oauth_unlinked'
  )),
  details JSONB DEFAULT '{}',
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_security_events_user_id (user_id),
  INDEX idx_security_events_event_type (event_type),
  INDEX idx_security_events_created_at (created_at),
  INDEX idx_security_events_severity (severity)
);

-- =============================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own security events
CREATE POLICY "Users can view own security events" ON security_events
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert security events
CREATE POLICY "Authenticated users can insert security events" ON security_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 🔍 SECURITY MONITORING FUNCTIONS
-- =============================================

-- Function to get recent suspicious activity
CREATE OR REPLACE FUNCTION get_suspicious_activity(
  user_uuid UUID DEFAULT auth.uid(),
  hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  event_count BIGINT,
  event_type TEXT,
  latest_event TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as event_count,
    se.event_type,
    MAX(se.created_at) as latest_event
  FROM security_events se
  WHERE se.user_id = user_uuid
    AND se.created_at >= NOW() - INTERVAL '1 hour' * hours_back
    AND se.event_type IN ('suspicious_activity', 'biometric_auth_failed')
  GROUP BY se.event_type
  HAVING COUNT(*) > 3; -- Flag if more than 3 suspicious events
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old security events (for GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete events older than 2 years
  DELETE FROM security_events 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 📊 SECURITY ANALYTICS VIEWS
-- =============================================

-- View for security dashboard
CREATE OR REPLACE VIEW security_dashboard AS
SELECT 
  user_id,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE event_type = 'login') as login_events,
  COUNT(*) FILTER (WHERE event_type = 'suspicious_activity') as suspicious_events,
  COUNT(*) FILTER (WHERE severity = 'high') as high_severity_events,
  MAX(created_at) as last_activity
FROM security_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY user_id;

-- =============================================
-- ⏰ AUTOMATED CLEANUP (Optional)
-- =============================================

-- Create a scheduled job to clean up old events (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-security-events', '0 2 * * 0', 'SELECT cleanup_old_security_events();');

-- =============================================
-- 🧪 SAMPLE DATA (for testing)
-- =============================================

-- Insert sample security events for testing
-- INSERT INTO security_events (user_id, event_type, details, severity, ip_address, user_agent) VALUES
-- (auth.uid(), 'login', '{"method": "email"}', 'low', '192.168.1.1', 'React Native App'),
-- (auth.uid(), 'mfa_enabled', '{"type": "totp"}', 'low', '192.168.1.1', 'React Native App'),
-- (auth.uid(), 'biometric_enabled', '{"type": "FaceID"}', 'low', '192.168.1.1', 'React Native App');

COMMENT ON TABLE security_events IS 'Stores all security-related events for audit and monitoring';
COMMENT ON COLUMN security_events.details IS 'JSON object containing event-specific details';
COMMENT ON COLUMN security_events.severity IS 'Event severity level for alerting and filtering';
COMMENT ON FUNCTION get_suspicious_activity IS 'Returns suspicious activity patterns for a user';
COMMENT ON FUNCTION cleanup_old_security_events IS 'Removes security events older than 2 years for GDPR compliance'; 