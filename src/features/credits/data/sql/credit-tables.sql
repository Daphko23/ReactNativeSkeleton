-- =============================================
-- CREDIT SYSTEM DATABASE SCHEMA
-- =============================================
-- File: credit-tables.sql
-- Description: Database schema für das Credit System
-- Version: 1.0.0
-- Author: ReactNativeSkeleton Enterprise Team
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREDIT PRODUCTS TABLE
-- =============================================
-- Stores available credit packages for purchase
CREATE TABLE IF NOT EXISTS credit_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL CHECK (credits > 0),
    bonus_credits INTEGER DEFAULT 0 CHECK (bonus_credits >= 0),
    price_usd DECIMAL(10,2) NOT NULL CHECK (price_usd > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    platform_product_id VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für performance
CREATE INDEX idx_credit_products_active ON credit_products(is_active) WHERE is_active = true;
CREATE INDEX idx_credit_products_platform ON credit_products(platform, is_active);
CREATE INDEX idx_credit_products_featured ON credit_products(is_featured, sort_order) WHERE is_featured = true;

-- =============================================
-- 2. CREDIT TRANSACTIONS TABLE
-- =============================================
-- Stores all credit transactions (purchases, bonuses, usage, etc.)
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('purchase', 'daily_bonus', 'referral', 'admin_grant', 'usage', 'refund', 'expiry')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_id VARCHAR(255), -- External reference (purchase ID, etc.)
    platform_transaction_id VARCHAR(255), -- Platform specific transaction ID
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für performance und queries
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_status ON credit_transactions(status);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_user_type ON credit_transactions(user_id, type);
CREATE INDEX idx_credit_transactions_user_date ON credit_transactions(user_id, created_at DESC);
CREATE INDEX idx_credit_transactions_reference ON credit_transactions(reference_id) WHERE reference_id IS NOT NULL;
CREATE INDEX idx_credit_transactions_platform ON credit_transactions(platform_transaction_id) WHERE platform_transaction_id IS NOT NULL;

-- =============================================
-- 3. CREDIT BALANCES TABLE
-- =============================================
-- Stores current credit balance für each user
CREATE TABLE IF NOT EXISTS credit_balances (
    user_id UUID PRIMARY KEY,
    balance INTEGER DEFAULT 0 CHECK (balance >= 0),
    lifetime_earned INTEGER DEFAULT 0 CHECK (lifetime_earned >= 0),
    lifetime_spent INTEGER DEFAULT 0 CHECK (lifetime_spent >= 0),
    last_daily_bonus_at TIMESTAMP WITH TIME ZONE,
    daily_bonus_streak INTEGER DEFAULT 0 CHECK (daily_bonus_streak >= 0),
    referral_count INTEGER DEFAULT 0 CHECK (referral_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für user lookups
CREATE INDEX idx_credit_balances_balance ON credit_balances(balance DESC);
CREATE INDEX idx_credit_balances_daily_bonus ON credit_balances(last_daily_bonus_at);

-- =============================================
-- 4. CREDIT REFERRALS TABLE
-- =============================================
-- Tracks referral relationships und bonuses
CREATE TABLE IF NOT EXISTS credit_referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_user_id UUID NOT NULL,
    referred_user_id UUID NOT NULL,
    referral_code VARCHAR(50) NOT NULL,
    referrer_credits_granted INTEGER DEFAULT 0,
    referred_credits_granted INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent self-referrals
    CONSTRAINT check_no_self_referral CHECK (referrer_user_id != referred_user_id),
    
    -- Ensure unique referral relationship
    CONSTRAINT uq_referral_relationship UNIQUE (referrer_user_id, referred_user_id)
);

-- Indexes
CREATE INDEX idx_credit_referrals_referrer ON credit_referrals(referrer_user_id);
CREATE INDEX idx_credit_referrals_referred ON credit_referrals(referred_user_id);
CREATE INDEX idx_credit_referrals_code ON credit_referrals(referral_code);
CREATE INDEX idx_credit_referrals_status ON credit_referrals(status);

-- =============================================
-- 5. CREDIT ANALYTICS TABLE
-- =============================================
-- Stores aggregated analytics data für reporting
CREATE TABLE IF NOT EXISTS credit_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    user_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint für daily metrics
    CONSTRAINT uq_daily_metric UNIQUE (date, metric_type)
);

-- Indexes für analytics queries
CREATE INDEX idx_credit_analytics_date ON credit_analytics(date DESC);
CREATE INDEX idx_credit_analytics_type ON credit_analytics(metric_type);
CREATE INDEX idx_credit_analytics_date_type ON credit_analytics(date, metric_type);

-- =============================================
-- 6. TRIGGERS FÜR AUTOMATIC UPDATES
-- =============================================

-- Update timestamps on table updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_credit_products_updated_at
    BEFORE UPDATE ON credit_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_transactions_updated_at
    BEFORE UPDATE ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_balances_updated_at
    BEFORE UPDATE ON credit_balances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 7. BALANCE UPDATE FUNCTION
-- =============================================
-- Function to update credit balance after transactions
CREATE OR REPLACE FUNCTION update_credit_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process completed transactions
    IF NEW.status = 'completed' THEN
        -- Insert or update balance record
        INSERT INTO credit_balances (user_id, balance, lifetime_earned, lifetime_spent)
        VALUES (
            NEW.user_id,
            CASE WHEN NEW.amount > 0 THEN NEW.amount ELSE 0 END,
            CASE WHEN NEW.amount > 0 THEN NEW.amount ELSE 0 END,
            CASE WHEN NEW.amount < 0 THEN ABS(NEW.amount) ELSE 0 END
        )
        ON CONFLICT (user_id) DO UPDATE SET
            balance = credit_balances.balance + NEW.amount,
            lifetime_earned = credit_balances.lifetime_earned + 
                CASE WHEN NEW.amount > 0 THEN NEW.amount ELSE 0 END,
            lifetime_spent = credit_balances.lifetime_spent + 
                CASE WHEN NEW.amount < 0 THEN ABS(NEW.amount) ELSE 0 END,
            updated_at = NOW();
            
        -- Update daily bonus streak für daily bonus transactions
        IF NEW.type = 'daily_bonus' THEN
            UPDATE credit_balances 
            SET 
                last_daily_bonus_at = NEW.created_at,
                daily_bonus_streak = CASE 
                    WHEN last_daily_bonus_at IS NULL OR 
                         last_daily_bonus_at < (NEW.created_at - INTERVAL '25 hours')
                    THEN 1
                    ELSE daily_bonus_streak + 1
                END
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply balance update trigger
CREATE TRIGGER update_balance_on_transaction
    AFTER INSERT OR UPDATE ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_credit_balance();

-- =============================================
-- 8. SAMPLE DATA (optional)
-- =============================================
-- Insert sample credit products
INSERT INTO credit_products (name, description, credits, bonus_credits, price_usd, platform_product_id, platform, is_featured, sort_order)
VALUES 
    ('Starter Pack', '12 Credits - Perfect zum Ausprobieren', 12, 0, 0.99, 'credits_starter', 'ios', false, 1),
    ('Popular Pack', '35 Credits + 5 Bonus', 35, 5, 2.99, 'credits_popular', 'ios', true, 2),
    ('Pro Pack', '75 Credits + 15 Bonus', 75, 15, 4.99, 'credits_pro', 'ios', false, 3),
    ('Ultimate Pack', '150 Credits + 30 Bonus', 150, 30, 9.99, 'credits_ultimate', 'ios', true, 4),
    
    -- Android versions
    ('Starter Pack', '12 Credits - Perfect zum Ausprobieren', 12, 0, 0.99, 'credits_starter', 'android', false, 1),
    ('Popular Pack', '35 Credits + 5 Bonus', 35, 5, 2.99, 'credits_popular', 'android', true, 2),
    ('Pro Pack', '75 Credits + 15 Bonus', 75, 15, 4.99, 'credits_pro', 'android', false, 3),
    ('Ultimate Pack', '150 Credits + 30 Bonus', 150, 30, 9.99, 'credits_ultimate', 'android', true, 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies für credit_transactions
CREATE POLICY "Users can view their own transactions"
    ON credit_transactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transactions"
    ON credit_transactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- RLS Policies für credit_balances
CREATE POLICY "Users can view their own balance"
    ON credit_balances FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own balance"
    ON credit_balances FOR ALL
    USING (user_id = auth.uid());

-- RLS Policies für credit_referrals
CREATE POLICY "Users can view their referrals"
    ON credit_referrals FOR SELECT
    USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals"
    ON credit_referrals FOR INSERT
    WITH CHECK (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

-- Products are public (readable by all authenticated users)
CREATE POLICY "Products are viewable by authenticated users"
    ON credit_products FOR SELECT
    USING (auth.role() = 'authenticated' AND is_active = true);

-- Analytics are admin-only (you'll need to define admin roles)
CREATE POLICY "Analytics are admin-only"
    ON credit_analytics FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- =============================================
-- 10. HELPER FUNCTIONS
-- =============================================

-- Function to get user balance
CREATE OR REPLACE FUNCTION get_user_credit_balance(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_balance INTEGER;
BEGIN
    SELECT COALESCE(balance, 0) INTO user_balance
    FROM credit_balances
    WHERE user_id = user_uuid;
    
    RETURN COALESCE(user_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if daily bonus can be claimed
CREATE OR REPLACE FUNCTION can_claim_daily_bonus(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    last_claim TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT last_daily_bonus_at INTO last_claim
    FROM credit_balances
    WHERE user_id = user_uuid;
    
    -- Can claim if never claimed or more than 20 hours ago
    RETURN last_claim IS NULL OR last_claim < (NOW() - INTERVAL '20 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily bonus amount based on streak
CREATE OR REPLACE FUNCTION get_daily_bonus_amount(current_streak INTEGER)
RETURNS INTEGER AS $$
BEGIN
    CASE 
        WHEN current_streak >= 6 THEN RETURN 7;  -- Day 7+
        WHEN current_streak >= 5 THEN RETURN 6;  -- Day 6
        WHEN current_streak >= 4 THEN RETURN 5;  -- Day 5
        WHEN current_streak >= 3 THEN RETURN 4;  -- Day 4
        WHEN current_streak >= 2 THEN RETURN 3;  -- Day 3
        WHEN current_streak >= 1 THEN RETURN 2;  -- Day 2
        ELSE RETURN 2;  -- Day 1
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- CREDIT SYSTEM SCHEMA COMPLETE
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 