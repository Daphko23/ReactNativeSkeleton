-- =============================================
-- 🔔 NOTIFICATIONS DATABASE SCHEMA
-- =============================================
-- Complete Supabase schema for notifications feature

-- =============================================
-- 📨 NOTIFICATIONS TABLE
-- =============================================
-- Stores notification history and metadata

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  data JSONB DEFAULT '{}',
  
  -- Metadata
  type TEXT NOT NULL CHECK (type IN ('system', 'user', 'marketing', 'security')),
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high')) DEFAULT 'normal',
  
  -- Delivery tracking
  fcm_token TEXT,
  delivery_status TEXT CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')) DEFAULT 'pending',
  delivery_attempt_count INTEGER DEFAULT 0,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- User interaction
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  action_required BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_category (category),
  INDEX idx_notifications_created_at (created_at),
  INDEX idx_notifications_delivery_status (delivery_status),
  INDEX idx_notifications_is_read (is_read)
);

-- =============================================
-- 🏷️ NOTIFICATION TOPICS TABLE
-- =============================================
-- Manages topic subscriptions

CREATE TABLE IF NOT EXISTS notification_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  requires_permission BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_notification_topics_category (category),
  INDEX idx_notification_topics_active (is_active)
);

-- =============================================
-- 📋 USER TOPIC SUBSCRIPTIONS TABLE
-- =============================================
-- Tracks user subscriptions to topics

CREATE TABLE IF NOT EXISTS user_topic_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES notification_topics(id) ON DELETE CASCADE,
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  -- Preferences for this subscription
  preferences JSONB DEFAULT '{
    "sound": true,
    "vibration": true,
    "priority": "normal"
  }',
  
  UNIQUE(user_id, topic_id),
  INDEX idx_user_subscriptions_user_id (user_id),
  INDEX idx_user_subscriptions_topic_id (topic_id),
  INDEX idx_user_subscriptions_subscribed (subscribed)
);

-- =============================================
-- ⚙️ USER NOTIFICATION SETTINGS TABLE
-- =============================================
-- User-specific notification preferences

CREATE TABLE IF NOT EXISTS user_notification_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Global settings
  enabled BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  vibration_enabled BOOLEAN DEFAULT TRUE,
  show_preview BOOLEAN DEFAULT TRUE,
  
  -- Do Not Disturb settings
  dnd_enabled BOOLEAN DEFAULT FALSE,
  dnd_start_time TIME DEFAULT '22:00',
  dnd_end_time TIME DEFAULT '08:00',
  dnd_weekdays BOOLEAN[] DEFAULT ARRAY[true, true, true, true, true, false, false],
  
  -- Category preferences
  category_settings JSONB DEFAULT '{
    "security": {"enabled": true, "sound": true, "vibration": true, "priority": "high"},
    "updates": {"enabled": true, "sound": true, "vibration": false, "priority": "normal"},
    "maintenance": {"enabled": true, "sound": false, "vibration": false, "priority": "normal"},
    "promotions": {"enabled": false, "sound": false, "vibration": false, "priority": "low"}
  }',
  
  -- Device tokens
  fcm_tokens JSONB DEFAULT '[]',
  apns_tokens JSONB DEFAULT '[]',
  
  -- Location preferences
  location_enabled BOOLEAN DEFAULT FALSE,
  location_radius INTEGER DEFAULT 1000,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 📊 NOTIFICATION ANALYTICS TABLE
-- =============================================
-- Analytics and metrics tracking

CREATE TABLE IF NOT EXISTS notification_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Time period
  date DATE NOT NULL,
  hour INTEGER CHECK (hour >= 0 AND hour <= 23),
  
  -- Aggregation level
  aggregation_type TEXT NOT NULL CHECK (aggregation_type IN ('global', 'user', 'topic', 'category')),
  reference_id UUID, -- user_id, topic_id, or NULL for global
  reference_value TEXT, -- category name or NULL
  
  -- Metrics
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  
  -- Performance metrics
  avg_delivery_time INTERVAL,
  avg_response_time INTERVAL,
  
  -- Engagement metrics
  engagement_rate DECIMAL(5,2) DEFAULT 0.0,
  click_through_rate DECIMAL(5,2) DEFAULT 0.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date, hour, aggregation_type, reference_id, reference_value),
  INDEX idx_analytics_date (date),
  INDEX idx_analytics_aggregation (aggregation_type),
  INDEX idx_analytics_reference (reference_id)
);

-- =============================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_analytics ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Allow system/admin to insert

CREATE POLICY "Users can update own notification status" ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Topics policies (read-only for users)
CREATE POLICY "Anyone can view active topics" ON notification_topics
  FOR SELECT USING (is_active = true);

-- Subscriptions policies
CREATE POLICY "Users can manage own subscriptions" ON user_topic_subscriptions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can manage own settings" ON user_notification_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analytics policies (users can view their own analytics)
CREATE POLICY "Users can view own analytics" ON notification_analytics
  FOR SELECT USING (
    aggregation_type = 'user' AND reference_id = auth.uid()
    OR aggregation_type = 'global'
  );

-- =============================================
-- ⚡ TRIGGERS & FUNCTIONS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update read status
CREATE OR REPLACE FUNCTION update_notification_read_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    NEW.read_at = NOW();
  END IF;
  
  IF NEW.clicked = true AND OLD.clicked = false THEN
    NEW.clicked_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER notification_read_trigger
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_read_status();

-- =============================================
-- 📈 ANALYTICS FUNCTIONS
-- =============================================

-- Generate daily analytics
CREATE OR REPLACE FUNCTION generate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
  analytics_record RECORD;
BEGIN
  -- Global daily analytics
  INSERT INTO notification_analytics (
    date, aggregation_type, total_sent, total_delivered, total_opened, total_clicked,
    engagement_rate, click_through_rate
  )
  SELECT 
    target_date,
    'global',
    COUNT(*) as total_sent,
    COUNT(*) FILTER (WHERE delivery_status = 'delivered') as total_delivered,
    COUNT(*) FILTER (WHERE is_read = true) as total_opened,
    COUNT(*) FILTER (WHERE clicked = true) as total_clicked,
    CASE 
      WHEN COUNT(*) FILTER (WHERE delivery_status = 'delivered') > 0 
      THEN (COUNT(*) FILTER (WHERE is_read = true)::DECIMAL / COUNT(*) FILTER (WHERE delivery_status = 'delivered')) * 100
      ELSE 0
    END as engagement_rate,
    CASE 
      WHEN COUNT(*) FILTER (WHERE is_read = true) > 0 
      THEN (COUNT(*) FILTER (WHERE clicked = true)::DECIMAL / COUNT(*) FILTER (WHERE is_read = true)) * 100
      ELSE 0
    END as click_through_rate
  FROM notifications 
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date, hour, aggregation_type, reference_id, reference_value) 
  DO UPDATE SET
    total_sent = EXCLUDED.total_sent,
    total_delivered = EXCLUDED.total_delivered,
    total_opened = EXCLUDED.total_opened,
    total_clicked = EXCLUDED.total_clicked,
    engagement_rate = EXCLUDED.engagement_rate,
    click_through_rate = EXCLUDED.click_through_rate;

  -- Category analytics
  FOR analytics_record IN 
    SELECT 
      category,
      COUNT(*) as total_sent,
      COUNT(*) FILTER (WHERE delivery_status = 'delivered') as total_delivered,
      COUNT(*) FILTER (WHERE is_read = true) as total_opened,
      COUNT(*) FILTER (WHERE clicked = true) as total_clicked
    FROM notifications 
    WHERE DATE(created_at) = target_date
    GROUP BY category
  LOOP
    INSERT INTO notification_analytics (
      date, aggregation_type, reference_value, total_sent, total_delivered, total_opened, total_clicked
    ) VALUES (
      target_date, 'category', analytics_record.category,
      analytics_record.total_sent, analytics_record.total_delivered,
      analytics_record.total_opened, analytics_record.total_clicked
    )
    ON CONFLICT (date, hour, aggregation_type, reference_id, reference_value) 
    DO UPDATE SET
      total_sent = EXCLUDED.total_sent,
      total_delivered = EXCLUDED.total_delivered,
      total_opened = EXCLUDED.total_opened,
      total_clicked = EXCLUDED.total_clicked;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user notification summary
CREATE OR REPLACE FUNCTION get_user_notification_summary(
  user_uuid UUID DEFAULT auth.uid(),
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_notifications BIGINT,
  unread_notifications BIGINT,
  urgent_notifications BIGINT,
  recent_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_notifications,
    COUNT(*) FILTER (WHERE is_read = false) as unread_notifications,
    COUNT(*) FILTER (WHERE is_read = false AND priority = 'high') as urgent_notifications,
    MAX(created_at) as recent_activity
  FROM notifications
  WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete notifications older than 90 days (except urgent ones)
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND priority != 'high';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Also clean up old analytics data (older than 1 year)
  DELETE FROM notification_analytics 
  WHERE date < CURRENT_DATE - INTERVAL '1 year';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 🌱 SEED DATA
-- =============================================

-- Insert default notification topics
INSERT INTO notification_topics (topic_name, display_name, description, category) VALUES
('security-alerts', 'Sicherheitswarnungen', 'Wichtige Sicherheitsmeldungen', 'security'),
('app-updates', 'App-Updates', 'Informationen über neue App-Versionen', 'updates'),
('maintenance', 'Wartungsarbeiten', 'Geplante Systemwartungen', 'system'),
('promotions', 'Angebote & Aktionen', 'Marketing-Mitteilungen und Angebote', 'marketing'),
('news', 'Neuigkeiten', 'Allgemeine Neuigkeiten und Ankündigungen', 'general'),
('beta-features', 'Beta-Features', 'Einladungen zu neuen Features', 'updates')
ON CONFLICT (topic_name) DO NOTHING;

-- =============================================
-- 📊 VIEWS FOR ANALYTICS
-- =============================================

-- Notification dashboard view
CREATE OR REPLACE VIEW notification_dashboard AS
SELECT 
  u.id as user_id,
  COUNT(n.*) as total_notifications,
  COUNT(n.*) FILTER (WHERE n.is_read = false) as unread_count,
  COUNT(n.*) FILTER (WHERE n.priority = 'high' AND n.is_read = false) as urgent_count,
  COUNT(n.*) FILTER (WHERE n.created_at >= NOW() - INTERVAL '24 hours') as today_count,
  MAX(n.created_at) as last_notification
FROM auth.users u
LEFT JOIN notifications n ON u.id = n.user_id
GROUP BY u.id;

-- Topic performance view
CREATE OR REPLACE VIEW topic_performance AS
SELECT 
  nt.topic_name,
  nt.display_name,
  COUNT(uts.*) as total_subscribers,
  COUNT(uts.*) FILTER (WHERE uts.subscribed = true) as active_subscribers,
  COUNT(n.*) as notifications_sent,
  COUNT(n.*) FILTER (WHERE n.is_read = true) as notifications_read,
  CASE 
    WHEN COUNT(n.*) > 0 
    THEN (COUNT(n.*) FILTER (WHERE n.is_read = true)::DECIMAL / COUNT(n.*)) * 100
    ELSE 0
  END as read_rate
FROM notification_topics nt
LEFT JOIN user_topic_subscriptions uts ON nt.id = uts.topic_id
LEFT JOIN notifications n ON nt.topic_name = n.category
WHERE nt.is_active = true
GROUP BY nt.id, nt.topic_name, nt.display_name;

-- =============================================
-- 💬 COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON TABLE notifications IS 'Stores all notification history with delivery tracking and user interactions';
COMMENT ON TABLE notification_topics IS 'Manages available notification topics/categories';
COMMENT ON TABLE user_topic_subscriptions IS 'Tracks user subscriptions to notification topics';
COMMENT ON TABLE user_notification_settings IS 'User-specific notification preferences and device tokens';
COMMENT ON TABLE notification_analytics IS 'Aggregated analytics data for notification performance tracking';

COMMENT ON FUNCTION generate_daily_analytics IS 'Generates daily analytics aggregations for notifications';
COMMENT ON FUNCTION get_user_notification_summary IS 'Returns notification summary for a specific user';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Removes old notifications for storage optimization'; 