/**
 * Credit Product DTOs - Data Layer
 * Supabase Database Transfer Objects für Produkte
 */

export interface CreditProductDTO {
  id: string;
  product_id: string;
  name: string;
  description: string;
  credits: number;
  bonus_credits: number;
  price: number;
  currency: string;
  localized_price: string;
  platform: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductCatalogDTO {
  products: CreditProductDTO[];
  last_updated: string;
  currency: string;
  region: string;
}

// In-App Purchase Platform-spezifische DTOs
export interface AppleProductDTO {
  product_id: string;
  type: 'consumable' | 'non_consumable';
  reference_name: string;
  cleared_for_sale: boolean;
  hosting_content_with_apple: boolean;
  price_tier: number;
  localized_metadata: {
    [locale: string]: {
      name: string;
      description: string;
      promotional_text?: string;
    };
  };
}

export interface GoogleProductDTO {
  product_id: string;
  type: 'managed' | 'subscription';
  status: 'active' | 'inactive';
  purchase_type: 'managedProduct';
  default_price: {
    price_micros: string;
    currency_code: string;
  };
  prices: {
    [region: string]: {
      price_micros: string;
      currency_code: string;
    };
  };
  localized_metadata: {
    [locale: string]: {
      title: string;
      description: string;
    };
  };
}

// Product Management DTOs
export interface UpdateProductPriceRequestDTO {
  product_id: string;
  price: number;
  currency: string;
  localized_price: string;
  platform: string;
}

export interface ProductPerformanceDTO {
  product_id: string;
  total_sales: number;
  total_revenue: number;
  conversion_rate: number;
  average_credits_per_purchase: number;
  last_30_days_sales: number;
  last_30_days_revenue: number;
  rank_by_sales: number;
  rank_by_revenue: number;
  first_sale_date: string;
  last_sale_date: string;
}

// Product Analytics DTOs
export interface ProductAnalyticsDTO {
  product_id: string;
  views: number;
  purchases: number;
  conversion_rate: number;
  revenue: number;
  refunds: number;
  net_revenue: number;
  date: string;
}

export interface ProductRevenueDTO {
  product_id: string;
  daily_revenue: number;
  weekly_revenue: number;
  monthly_revenue: number;
  total_revenue: number;
  currency: string;
  last_updated: string;
} 