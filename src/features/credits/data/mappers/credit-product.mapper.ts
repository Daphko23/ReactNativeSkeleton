/**
 * Credit Product Mapper - Data Layer
 * Transformation zwischen Domain Product Entities und DTOs
 */

import { CreditProduct, ProductCatalog, Platform } from '../../domain/entities/credit-product.entity';
import { CreditProductDTO, ProductCatalogDTO } from '../dtos/credit-product.dto';

export class CreditProductMapper {
  static toDomain(dto: CreditProductDTO): CreditProduct {
    return {
      id: dto.id,
      productId: dto.product_id,
      name: dto.name,
      description: dto.description,
      credits: dto.credits,
      bonusCredits: dto.bonus_credits,
      price: dto.price,
      currency: dto.currency,
      localizedPrice: dto.localized_price,
      platform: dto.platform as Platform,
      isPopular: dto.is_popular,
      isActive: dto.is_active,
      sortOrder: dto.sort_order,
      metadata: dto.metadata,
    };
  }

  static toDTO(domain: Omit<CreditProduct, 'id'>): Omit<CreditProductDTO, 'id' | 'created_at' | 'updated_at'> {
    return {
      product_id: domain.productId,
      name: domain.name,
      description: domain.description,
      credits: domain.credits,
      bonus_credits: domain.bonusCredits,
      price: domain.price,
      currency: domain.currency,
      localized_price: domain.localizedPrice,
      platform: domain.platform,
      is_popular: domain.isPopular,
      is_active: domain.isActive,
      sort_order: domain.sortOrder,
      metadata: domain.metadata,
    };
  }

  static toDomainArray(dtos: CreditProductDTO[]): CreditProduct[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static toDTOArray(domains: Omit<CreditProduct, 'id'>[]): Omit<CreditProductDTO, 'id' | 'created_at' | 'updated_at'>[] {
    return domains.map(domain => this.toDTO(domain));
  }
}

export class ProductCatalogMapper {
  static toDomain(dto: ProductCatalogDTO): ProductCatalog {
    return {
      products: CreditProductMapper.toDomainArray(dto.products),
      lastUpdated: new Date(dto.last_updated),
      currency: dto.currency,
      region: dto.region,
    };
  }

  static toDTO(domain: ProductCatalog): ProductCatalogDTO {
    return {
      products: domain.products.map(product => ({
        ...CreditProductMapper.toDTO(product),
        id: product.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      last_updated: domain.lastUpdated.toISOString(),
      currency: domain.currency,
      region: domain.region,
    };
  }
}

export class ProductMapperUtils {
  static parsePlatform(platform: string): Platform {
    const validPlatforms: Platform[] = ['ios', 'android', 'web'];
    
    if (validPlatforms.includes(platform as Platform)) {
      return platform as Platform;
    }
    
    throw new Error(`Invalid platform: ${platform}`);
  }

  static validateProductData(product: Partial<CreditProduct>): void {
    if (product.credits !== undefined && (!Number.isInteger(product.credits) || product.credits <= 0)) {
      throw new Error('Credits must be a positive integer');
    }

    if (product.bonusCredits !== undefined && (!Number.isInteger(product.bonusCredits) || product.bonusCredits < 0)) {
      throw new Error('Bonus credits must be a non-negative integer');
    }

    if (product.price !== undefined && (!Number.isFinite(product.price) || product.price < 0)) {
      throw new Error('Price must be a non-negative number');
    }

    if (product.sortOrder !== undefined && (!Number.isInteger(product.sortOrder) || product.sortOrder < 0)) {
      throw new Error('Sort order must be a non-negative integer');
    }

    if (product.productId && product.productId.length === 0) {
      throw new Error('Product ID cannot be empty');
    }

    if (product.name && product.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (product.currency && !/^[A-Z]{3}$/.test(product.currency)) {
      throw new Error('Currency must be a valid 3-letter ISO code');
    }
  }

  static sanitizeProductMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    const allowedKeys = [
      'originalProductId',
      'subscriptionGroupId',
      'introductoryPrice',
      'freeTrialPeriod',
      'discountPercentage',
      'limitedTimeOffer',
      'offerEndDate',
      'features'
    ];

    for (const [key, value] of Object.entries(metadata)) {
      if (allowedKeys.includes(key)) {
        if (key === 'features' && Array.isArray(value)) {
          // Validate features array
          const validFeatures = value.filter(
            feature => typeof feature === 'string' && feature.trim().length > 0
          );
          if (validFeatures.length > 0) {
            sanitized[key] = validFeatures;
          }
        } else if (key === 'offerEndDate' && typeof value === 'string') {
          try {
            new Date(value);
            sanitized[key] = value;
          } catch {
            // Skip invalid date
          }
        } else if (key === 'discountPercentage' && typeof value === 'number') {
          if (value >= 0 && value <= 100) {
            sanitized[key] = value;
          }
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        }
      }
    }

    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  static createProductFromConfig(
    productId: string,
    tier: string,
    config: {
      credits: number;
      bonusCredits: number;
      popular: boolean;
      sortOrder: number;
    },
    platformData: {
      platform: Platform;
      price: number;
      currency: string;
      localizedPrice: string;
    }
  ): Omit<CreditProduct, 'id'> {
    const tierNames: Record<string, string> = {
      starter: 'Starter Pack',
      popular: 'Popular Pack',
      pro: 'Pro Pack',
      ultimate: 'Ultimate Pack'
    };

    const tierDescriptions: Record<string, string> = {
      starter: 'Perfect for getting started',
      popular: 'Most popular choice',
      pro: 'For power users',
      ultimate: 'Maximum value pack'
    };

    return {
      productId,
      name: tierNames[tier] || `${tier} Pack`,
      description: tierDescriptions[tier] || `${config.credits + config.bonusCredits} credits`,
      credits: config.credits,
      bonusCredits: config.bonusCredits,
      price: platformData.price,
      currency: platformData.currency,
      localizedPrice: platformData.localizedPrice,
      platform: platformData.platform,
      isPopular: config.popular,
      isActive: true,
      sortOrder: config.sortOrder,
      metadata: {
        tier,
        totalCredits: config.credits + config.bonusCredits,
      } as Record<string, any>
    };
  }
} 