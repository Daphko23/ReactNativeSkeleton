/**
 * CreditProduct Entity - Domain Layer
 * Repräsentiert verfügbare Credit-Pakete für den Kauf
 */

export interface CreditProduct {
  id: string;
  productId: string;
  name: string;
  description: string;
  credits: number;
  bonusCredits: number;
  price: number;
  currency: string;
  localizedPrice: string;
  platform: Platform;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  metadata?: ProductMetadata;
}

export type Platform = 'ios' | 'android' | 'web';

export interface ProductMetadata {
  originalProductId?: string;
  subscriptionGroupId?: string;
  introductoryPrice?: string;
  freeTrialPeriod?: string;
  discountPercentage?: number;
  limitedTimeOffer?: boolean;
  offerEndDate?: Date;
  features?: string[];
}

export interface ProductPurchase {
  productId: string;
  transactionId: string;
  purchaseToken: string;
  receipt: string;
  platform: Platform;
  purchaseDate: Date;
  isTestPurchase: boolean;
}

export interface ProductCatalog {
  products: CreditProduct[];
  lastUpdated: Date;
  currency: string;
  region: string;
}

// Vordefinierte Produkt-Konfiguration
export const CREDIT_PRODUCTS_CONFIG = {
  starter: {
    credits: 12,
    bonusCredits: 0,
    popular: false,
    sortOrder: 1,
  },
  popular: {
    credits: 35,
    bonusCredits: 5,
    popular: true,
    sortOrder: 2,
  },
  pro: {
    credits: 75,
    bonusCredits: 15,
    popular: false,
    sortOrder: 3,
  },
  ultimate: {
    credits: 150,
    bonusCredits: 30,
    popular: false,
    sortOrder: 4,
  },
} as const;

export type ProductTier = keyof typeof CREDIT_PRODUCTS_CONFIG; 