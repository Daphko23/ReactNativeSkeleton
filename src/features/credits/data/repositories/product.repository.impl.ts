/**
 * Product Repository Implementation - Data Layer
 * Implementiert die IProductRepository Domain Interface
 */

import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import { CreditProduct, ProductCatalog } from '../../domain/entities/credit-product.entity';
import { SupabaseCreditDataSource } from '../datasources/supabase-credit.datasource';
import { CreditProductMapper } from '../mappers/credit-product.mapper';
import { ProductNotFoundError } from '../../domain/errors/credit-errors';

export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly dataSource: SupabaseCreditDataSource) {}

  async getActiveProducts(platform?: string): Promise<CreditProduct[]> {
    const productDTOs = await this.dataSource.getActiveProducts(platform);
    return CreditProductMapper.toDomainArray(productDTOs);
  }

  async getProduct(productId: string): Promise<CreditProduct | null> {
    const productDTO = await this.dataSource.getProduct(productId);
    
    if (!productDTO) {
      return null;
    }

    return CreditProductMapper.toDomain(productDTO);
  }

  async getProductCatalog(platform: string, region: string): Promise<ProductCatalog> {
    const products = await this.getActiveProducts(platform);
    
    return {
      products,
      lastUpdated: new Date(),
      currency: this.getCurrencyForRegion(region),
      region,
    };
  }

  async updateProductPrices(_products: Partial<CreditProduct>[]): Promise<void> {
    // TODO: Implement batch update for product prices
    // This would typically involve admin operations
    throw new Error('Product price updates not implemented yet');
  }

  async setProductActive(productId: string, isActive: boolean): Promise<void> {
    const existingProduct = await this.dataSource.getProduct(productId);
    
    if (!existingProduct) {
      throw new ProductNotFoundError(productId);
    }

    await this.dataSource.updateProductActive(productId, isActive);
  }

  private getCurrencyForRegion(region: string): string {
    const regionCurrencyMap: Record<string, string> = {
      'US': 'USD',
      'EU': 'EUR',
      'GB': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'JP': 'JPY',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'NL': 'EUR',
      'CH': 'CHF',
      'SE': 'SEK',
      'NO': 'NOK',
      'DK': 'DKK',
      'PL': 'PLN',
      'CZ': 'CZK',
      'HU': 'HUF',
      'RO': 'RON',
      'BG': 'BGN',
      'HR': 'HRK',
      'SI': 'EUR',
      'SK': 'EUR',
      'EE': 'EUR',
      'LV': 'EUR',
      'LT': 'EUR',
      'LU': 'EUR',
      'MT': 'EUR',
      'CY': 'EUR',
      'FI': 'EUR',
      'AT': 'EUR',
      'BE': 'EUR',
      'IE': 'EUR',
      'PT': 'EUR',
      'GR': 'EUR',
    };

    return regionCurrencyMap[region.toUpperCase()] || 'USD';
  }

  // IProductRepository interface methods
  async getProducts(): Promise<any[]> {
    return await this.getActiveProducts();
  }

  async getProductById(id: string): Promise<any | null> {
    return await this.getProduct(id);
  }

  async getById(id: string): Promise<any | null> {
    return await this.getProduct(id);
  }

  async verifyPurchase(_productId: string, _receipt: string): Promise<boolean> {
    // TODO: Implement actual purchase verification
    return true;
  }

  async createMany(_products: CreditProduct[]): Promise<void> {
    // TODO: Implement bulk product creation
    throw new Error('Not implemented yet');
  }
} 