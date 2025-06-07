/**
 * @fileoverview Product Repository Interface
 * @description Repository interface for product operations
 * 
 * @module IProductRepository
 */

export interface IProductRepository {
  getProducts(): Promise<any[]>;
  getProductById(id: string): Promise<any | null>;
  getById(id: string): Promise<any | null>;
  verifyPurchase(productId: string, receipt: string): Promise<boolean>;
} 