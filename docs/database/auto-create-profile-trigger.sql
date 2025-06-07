-- =============================================
-- 🚀 AUTO-CREATE PROFILE TRIGGER
-- =============================================
-- This trigger automatically creates a user profile when a new user is registered

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION auto_create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = NEW.id) INTO profile_exists;
  
  -- Only create profile if it doesn't exist
  IF NOT profile_exists THEN
    INSERT INTO user_profiles (
      user_id,
      email,
      first_name,
      last_name,
      display_name,
      preferences,
      privacy_settings,
      is_active,
      role,
      professional_info,
      custom_fields,
      metadata,
      profile_completion_rate,
      is_verified
    ) VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name'),
      '{
        "theme": "system",
        "language": "de",
        "timezone": "Europe/Berlin",
        "currency": "EUR",
        "notifications": true
      }'::JSONB,
      '{
        "profile_visibility": "public",
        "email_visibility": "private",
        "phone_visibility": "private",
        "location_visibility": "public",
        "social_links_visibility": "public"
      }'::JSONB,
      true,
      'user',
      '{}'::JSONB,
      '{}'::JSONB,
      '{
        "source": "auto_registration",
        "created_via": "app"
      }'::JSONB,
      20, -- Basic completion for having email and potentially name
      false
    );
    
    -- Create initial privacy settings
    INSERT INTO profile_privacy_settings (
      user_id,
      profile_visibility,
      search_visibility,
      directory_listing,
      field_privacy,
      allow_friend_requests,
      allow_direct_messages,
      allow_profile_views,
      allow_analytics,
      allow_marketing,
      allow_third_party_sharing,
      show_online_status,
      show_last_active,
      track_profile_views
    ) VALUES (
      NEW.id,
      'public',
      true,
      true,
      '{
        "email": "private",
        "phone": "private",
        "date_of_birth": "friends",
        "location": "public",
        "social_links": "public",
        "professional_info": "public"
      }'::JSONB,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      false,
      true
    );
    
    -- Create initial credit balance (if credits system is enabled)
    INSERT INTO credit_balances (
      user_id,
      balance,
      lifetime_earned,
      lifetime_spent,
      daily_bonus_streak,
      last_daily_bonus_at
    ) VALUES (
      NEW.id,
      100, -- Welcome bonus of 100 credits
      100,
      0,
      0,
      NULL
    ) ON CONFLICT (user_id) DO NOTHING;
    
    -- Log profile creation event
    INSERT INTO security_events (
      user_id,
      event_type,
      details,
      severity,
      ip_address,
      user_agent
    ) VALUES (
      NEW.id,
      'login',
      '{
        "event": "profile_auto_created",
        "source": "registration_trigger",
        "timestamp": "' || NOW() || '"
      }'::JSONB,
      'low',
      NULL,
      NULL
    );
    
    RAISE NOTICE 'Auto-created profile for user %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS auto_create_profile_trigger ON auth.users;
CREATE TRIGGER auto_create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_user_profile();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT ALL ON auth.users TO postgres;

COMMENT ON FUNCTION auto_create_user_profile() IS 'Automatically creates user profile, privacy settings, and initial credit balance when a new user registers';
COMMENT ON TRIGGER auto_create_profile_trigger ON auth.users IS 'Trigger that creates user profile automatically upon registration'; 