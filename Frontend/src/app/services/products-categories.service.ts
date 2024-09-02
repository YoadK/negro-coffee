import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from '../Utils/app.config';
import { lastValueFrom } from 'rxjs';
import { ProductCategoryModel } from '../models/product.category.Model';
import { ProductModel } from '../models/product.model';
import { notify } from '../Utils/Notify';

@Injectable({
    providedIn: 'root'
})
export class ProductsCategoriesService {

    constructor(private http: HttpClient) { }

    
  async getProductsByCategoryId(categoryId: string): Promise<ProductModel[]> {
    try {
      const products = await lastValueFrom(this.http.get<ProductModel[]>(`${appConfig.productsUrl}category/${categoryId}`));
      console.log('Fetched products for category:', categoryId, products.length);
      return products;
    } catch (error) {
        console.error('Error fetching Products By CategoryId', error);
      throw error;
    }
  }



    // Purpose: Fetch all product-category associations
    // Use case: When you need to know which products belong to which categories for all products
    async getAllProductCategoryAssociations(): Promise<ProductCategoryModel[]> {
        try {
            const associations = await lastValueFrom(this.http.get<ProductCategoryModel[]>(`${appConfig.productsUrl}categories`));
            console.log('Fetched all product-category associations:', associations.length);
            return associations;
        } catch (error) {
            console.error('Error fetching product-category associations:', error);
            throw error;
        }
    }
    
    // Purpose: Fetch product-category associations for a specific category
    // Use case: When you want to know which products belong to a particular category
    async getProductCategoryAssociationsByCategory(categoryId: string): Promise<ProductCategoryModel[]> {
        try {
            const associations = await lastValueFrom(this.http.get<ProductCategoryModel[]>(`${appConfig.categoriesUrl}${categoryId}/products`));
            console.log('Fetched product-category associations for category:', categoryId, associations.length);
            return associations;
        } catch (error) {
            console.error('Error fetching product-category associations by category:', error);
            throw error;
        }
    }

    // Purpose: Fetch full details of a specific product
    // Use case: When you need complete information about a product (e.g., for display in a product list or detail page)
    async getProductDetails(productId: string): Promise<ProductModel> {
        try {
            const product = await lastValueFrom(this.http.get<ProductModel>(`${appConfig.productsUrl}${productId}`));
            console.log('Fetched product details for:', productId);
            return product;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }

    
}