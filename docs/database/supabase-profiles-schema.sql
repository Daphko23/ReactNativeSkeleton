-- =============================================
-- 👤 PROFILES DATABASE SCHEMA
-- =============================================
-- Complete Supabase schema for profiles feature

-- =============================================
-- 👥 USER PROFILES TABLE
-- =============================================
-- Core user profile information

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Basic Information
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  
  -- Profile Details
  avatar TEXT, -- URL to avatar image
  bio TEXT,
  location TEXT,
  website TEXT,
  
  -- Social Links
  social_links JSONB DEFAULT '{}',
  
  -- Preferences & Settings
  preferences JSONB DEFAULT '{
    "theme": "system",
    "language": "de",
    "timezone": "Europe/Berlin",
    "currency": "EUR",
    "notifications": true
  }',
  
  -- Privacy Settings
  privacy_settings JSONB DEFAULT '{
    "profile_visibility": "public",
    "email_visibility": "private",
    "phone_visibility": "private",
    "location_visibility": "public",
    "social_links_visibility": "public"
  }',
  
  -- Status & Role
  is_active BOOLEAN DEFAULT TRUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator', 'premium')),
  
  -- Professional Information
  professional_info JSONB DEFAULT '{}',
  
  -- Custom Fields & Metadata
  custom_fields JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  -- Completion & Verification
  profile_completion_rate INTEGER DEFAULT 0 CHECK (profile_completion_rate >= 0 AND profile_completion_rate <= 100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_type TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes for performance
  INDEX idx_user_profiles_email (email),
  INDEX idx_user_profiles_display_name (display_name),
  INDEX idx_user_profiles_role (role),
  INDEX idx_user_profiles_is_active (is_active),
  INDEX idx_user_profiles_updated_at (updated_at)
);

-- =============================================
-- 📚 PROFILE HISTORY TABLE
-- =============================================
-- Tracks all changes to user profiles

CREATE TABLE IF NOT EXISTS profile_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Change Information
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  change_reason TEXT,
  
  -- Change Context
  changed_by UUID REFERENCES auth.users(id),
  changed_from_ip INET,
  user_agent TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_profile_history_user_id (user_id),
  INDEX idx_profile_history_changed_at (changed_at),
  INDEX idx_profile_history_field_name (field_name)
);

-- =============================================
-- 📦 PROFILE VERSIONS TABLE
-- =============================================
-- Stores complete profile snapshots for versioning

CREATE TABLE IF NOT EXISTS profile_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Version Information
  version_number INTEGER NOT NULL,
  description TEXT,
  tags TEXT[],
  
  -- Profile Data Snapshot
  profile_data JSONB NOT NULL,
  
  -- Version Metadata
  is_backup BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, version_number),
  INDEX idx_profile_versions_user_id (user_id),
  INDEX idx_profile_versions_version (version_number),
  INDEX idx_profile_versions_created_at (created_at)
);

-- =============================================
-- 🏷️ CUSTOM FIELD DEFINITIONS TABLE
-- =============================================
-- Defines available custom fields for profiles

CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Field Definition
  field_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'boolean', 'date', 'select', 'multiselect', 'url', 'email')),
  
  -- Validation Rules
  is_required BOOLEAN DEFAULT FALSE,
  validation_rules JSONB DEFAULT '{}',
  default_value TEXT,
  options JSONB, -- For select/multiselect fields
  
  -- Visibility & Privacy
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'friends')),
  category TEXT DEFAULT 'general',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_custom_fields_category (category),
  INDEX idx_custom_fields_active (is_active)
);

-- =============================================
-- 🔐 PROFILE PRIVACY SETTINGS TABLE
-- =============================================
-- Detailed privacy settings for each user

CREATE TABLE IF NOT EXISTS profile_privacy_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Visibility Settings
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  search_visibility BOOLEAN DEFAULT TRUE,
  directory_listing BOOLEAN DEFAULT TRUE,
  
  -- Field-specific Privacy
  field_privacy JSONB DEFAULT '{
    "email": "private",
    "phone": "private",
    "date_of_birth": "friends",
    "location": "public",
    "social_links": "public",
    "professional_info": "public"
  }',
  
  -- Communication Preferences
  allow_friend_requests BOOLEAN DEFAULT TRUE,
  allow_direct_messages BOOLEAN DEFAULT TRUE,
  allow_profile_views BOOLEAN DEFAULT TRUE,
  
  -- Data Sharing
  allow_analytics BOOLEAN DEFAULT TRUE,
  allow_marketing BOOLEAN DEFAULT FALSE,
  allow_third_party_sharing BOOLEAN DEFAULT FALSE,
  
  -- Activity Tracking
  show_online_status BOOLEAN DEFAULT TRUE,
  show_last_active BOOLEAN DEFAULT FALSE,
  track_profile_views BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 📊 PROFILE ANALYTICS TABLE
-- =============================================
-- Analytics and usage statistics

CREATE TABLE IF NOT EXISTS profile_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Analytics Period
  date DATE NOT NULL,
  
  -- Profile Statistics
  profile_views INTEGER DEFAULT 0,
  profile_updates INTEGER DEFAULT 0,
  search_appearances INTEGER DEFAULT 0,
  
  -- Engagement Metrics
  connections_made INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  
  -- Completion Metrics
  completion_rate INTEGER DEFAULT 0,
  fields_completed INTEGER DEFAULT 0,
  total_fields INTEGER DEFAULT 0,
  
  -- Social Activity
  social_interactions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date),
  INDEX idx_profile_analytics_user_id (user_id),
  INDEX idx_profile_analytics_date (date)
);

-- =============================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view public profiles or own profile" ON user_profiles
  FOR SELECT USING (
    is_active = true AND (
      auth.uid() = user_id OR
      (privacy_settings->>'profile_visibility')::text = 'public'
    )
  );

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profile History policies
CREATE POLICY "Users can view own profile history" ON profile_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert profile history" ON profile_history
  FOR INSERT WITH CHECK (true); -- Allow system to track changes

-- Profile Versions policies
CREATE POLICY "Users can manage own profile versions" ON profile_versions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Custom Field Definitions policies (read-only for users)
CREATE POLICY "Anyone can view active custom fields" ON custom_field_definitions
  FOR SELECT USING (is_active = true);

-- Privacy Settings policies
CREATE POLICY "Users can manage own privacy settings" ON profile_privacy_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON profile_analytics
  FOR SELECT USING (auth.uid() = user_id);

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

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_fields_updated_at
  BEFORE UPDATE ON custom_field_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON profile_privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Track profile changes automatically
CREATE OR REPLACE FUNCTION track_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
  field_key TEXT;
  old_val JSONB;
  new_val JSONB;
BEGIN
  -- Only track updates, not inserts or deletes
  IF TG_OP = 'UPDATE' THEN
    -- Check each field for changes
    FOR field_key IN SELECT unnest(ARRAY['email', 'first_name', 'last_name', 'display_name', 'phone', 'date_of_birth', 'avatar', 'bio', 'location', 'website', 'social_links', 'preferences', 'privacy_settings', 'role', 'is_active']) LOOP
      -- Get old and new values
      EXECUTE format('SELECT to_jsonb($1.%I)', field_key) INTO old_val USING OLD;
      EXECUTE format('SELECT to_jsonb($1.%I)', field_key) INTO new_val USING NEW;
      
      -- If values are different, log the change
      IF old_val IS DISTINCT FROM new_val THEN
        INSERT INTO profile_history (
          user_id, field_name, old_value, new_value, change_type, changed_by
        ) VALUES (
          NEW.user_id, field_key, old_val, new_val, 'update', auth.uid()
        );
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER profile_changes_trigger
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_profile_changes();

-- Update profile completion rate
CREATE OR REPLACE FUNCTION calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion_rate INTEGER;
  total_fields INTEGER := 10; -- Adjust based on required fields
  completed_fields INTEGER := 0;
BEGIN
  -- Count completed required fields
  IF NEW.first_name IS NOT NULL AND NEW.first_name != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.last_name IS NOT NULL AND NEW.last_name != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.date_of_birth IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.avatar IS NOT NULL AND NEW.avatar != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.location IS NOT NULL AND NEW.location != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.website IS NOT NULL AND NEW.website != '' THEN completed_fields := completed_fields + 1; END IF;
  IF NEW.social_links IS NOT NULL AND jsonb_array_length(jsonb_object_keys(NEW.social_links)) > 0 THEN completed_fields := completed_fields + 1; END IF;
  
  -- Calculate percentage
  completion_rate := (completed_fields * 100) / total_fields;
  
  -- Update the completion rate
  NEW.profile_completion_rate := completion_rate;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER profile_completion_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completion();

-- =============================================
-- 📈 ANALYTICS FUNCTIONS
-- =============================================

-- Get profile completion statistics
CREATE OR REPLACE FUNCTION get_profile_completion_stats()
RETURNS TABLE (
  total_profiles BIGINT,
  active_profiles BIGINT,
  verified_profiles BIGINT,
  avg_completion_rate NUMERIC,
  completion_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_profiles,
    COUNT(*) FILTER (WHERE is_active = true) as active_profiles,
    COUNT(*) FILTER (WHERE is_verified = true) as verified_profiles,
    AVG(profile_completion_rate) as avg_completion_rate,
    jsonb_build_object(
      '0-25', COUNT(*) FILTER (WHERE profile_completion_rate BETWEEN 0 AND 25),
      '26-50', COUNT(*) FILTER (WHERE profile_completion_rate BETWEEN 26 AND 50),
      '51-75', COUNT(*) FILTER (WHERE profile_completion_rate BETWEEN 51 AND 75),
      '76-100', COUNT(*) FILTER (WHERE profile_completion_rate BETWEEN 76 AND 100)
    ) as completion_distribution
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
  user_uuid UUID DEFAULT auth.uid(),
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  profile_updates BIGINT,
  last_update TIMESTAMP WITH TIME ZONE,
  version_count BIGINT,
  total_changes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE ph.change_type = 'update' AND ph.changed_at >= NOW() - INTERVAL '1 day' * days_back) as profile_updates,
    MAX(up.updated_at) as last_update,
    COUNT(DISTINCT pv.id) as version_count,
    COUNT(*) as total_changes
  FROM user_profiles up
  LEFT JOIN profile_history ph ON up.user_id = ph.user_id
  LEFT JOIN profile_versions pv ON up.user_id = pv.user_id
  WHERE up.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search profiles with advanced filters
CREATE OR REPLACE FUNCTION search_profiles(
  search_query TEXT DEFAULT '',
  role_filter TEXT DEFAULT NULL,
  location_filter TEXT DEFAULT NULL,
  is_active_filter BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  display_name TEXT,
  email TEXT,
  location TEXT,
  role TEXT,
  completion_rate INTEGER,
  last_active TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    CONCAT(up.first_name, ' ', up.last_name) as full_name,
    up.display_name,
    CASE 
      WHEN (up.privacy_settings->>'email_visibility')::text = 'public' THEN up.email
      ELSE 'hidden'
    END as email,
    up.location,
    up.role,
    up.profile_completion_rate as completion_rate,
    up.last_active_at as last_active
  FROM user_profiles up
  WHERE 
    (search_query = '' OR (
      up.first_name ILIKE '%' || search_query || '%' OR
      up.last_name ILIKE '%' || search_query || '%' OR
      up.display_name ILIKE '%' || search_query || '%' OR
      up.bio ILIKE '%' || search_query || '%'
    ))
    AND (role_filter IS NULL OR up.role = role_filter)
    AND (location_filter IS NULL OR up.location ILIKE '%' || location_filter || '%')
    AND (is_active_filter IS NULL OR up.is_active = is_active_filter)
    AND up.is_active = true
    AND (up.privacy_settings->>'profile_visibility')::text IN ('public', 'friends')
  ORDER BY up.updated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 🌱 SEED DATA
-- =============================================

-- Insert default custom field definitions
INSERT INTO custom_field_definitions (field_key, label, description, field_type, category) VALUES
('company', 'Unternehmen', 'Name des aktuellen Unternehmens', 'text', 'professional'),
('job_title', 'Berufsbezeichnung', 'Aktuelle Position', 'text', 'professional'),
('industry', 'Branche', 'Arbeitsbereich oder Industrie', 'select', 'professional'),
('skills', 'Fähigkeiten', 'Berufliche Kompetenzen', 'multiselect', 'professional'),
('experience_years', 'Berufserfahrung', 'Jahre der Berufserfahrung', 'number', 'professional'),
('education', 'Ausbildung', 'Höchster Bildungsabschluss', 'text', 'personal'),
('interests', 'Interessen', 'Hobbys und Interessen', 'multiselect', 'personal'),
('languages', 'Sprachen', 'Gesprochene Sprachen', 'multiselect', 'personal')
ON CONFLICT (field_key) DO NOTHING;

-- =============================================
-- 📊 VIEWS FOR ANALYTICS
-- =============================================

-- Profile dashboard view
CREATE OR REPLACE VIEW profile_dashboard AS
SELECT 
  up.user_id,
  CONCAT(up.first_name, ' ', up.last_name) as full_name,
  up.email,
  up.role,
  up.is_active,
  up.profile_completion_rate,
  up.is_verified,
  up.created_at,
  up.updated_at,
  up.last_active_at,
  COUNT(ph.*) as total_changes,
  COUNT(pv.*) as total_versions
FROM user_profiles up
LEFT JOIN profile_history ph ON up.user_id = ph.user_id
LEFT JOIN profile_versions pv ON up.user_id = pv.user_id
GROUP BY up.user_id;

-- Profile completion analysis view
CREATE OR REPLACE VIEW profile_completion_analysis AS
SELECT 
  role,
  COUNT(*) as total_profiles,
  AVG(profile_completion_rate) as avg_completion,
  COUNT(*) FILTER (WHERE profile_completion_rate >= 80) as highly_complete,
  COUNT(*) FILTER (WHERE profile_completion_rate < 50) as incomplete
FROM user_profiles
WHERE is_active = true
GROUP BY role;

-- =============================================
-- 💬 COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON TABLE user_profiles IS 'Main user profile information with privacy settings and completion tracking';
COMMENT ON TABLE profile_history IS 'Audit trail of all profile changes for transparency and rollback capabilities';
COMMENT ON TABLE profile_versions IS 'Complete profile snapshots for versioning and backup purposes';
COMMENT ON TABLE custom_field_definitions IS 'Defines additional custom fields that can be added to profiles';
COMMENT ON TABLE profile_privacy_settings IS 'Detailed privacy controls for each user profile';
COMMENT ON TABLE profile_analytics IS 'Usage analytics and engagement metrics for profiles';

COMMENT ON FUNCTION get_profile_completion_stats IS 'Returns overall profile completion statistics across all users';
COMMENT ON FUNCTION get_user_activity_summary IS 'Returns activity summary for a specific user';
COMMENT ON FUNCTION search_profiles IS 'Advanced profile search with privacy-aware results'; 