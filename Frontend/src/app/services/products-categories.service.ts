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

    // Purpose: Fetch all product-category associations
    // Use case: When you need to know which products belong to which categories for all products
    async getAllProductCategoryAssociations(): Promise<ProductCategoryModel[]> {
        try {
            const associations = await lastValueFrom(this.http.get<ProductCategoryModel[]>(`${appConfig.productsUrl}categories`));
            console.log('Fetched all product-category associations:', associations.length);
            return associations;
        } catch (error) {
            console.error('Error fetching product-category associations:', error);
            this.handleError(error);
            throw error;
        }
    }


    async addProductToCategories(productId: string): Promise<void> {
        try {
            await lastValueFrom(this.http.post(`${appConfig.productsUrl}categories/${productId}`, {}));
            console.log('Added product to categories:', productId);
        } catch (error) {
            console.error('Error adding product to categories:', error);
            this.handleError(error);
            throw error;
        }
    }

    async updateProductCategories(productId: string, categoryIds: string[]): Promise<void> {
        try {
            await lastValueFrom(this.http.put(`${appConfig.productsUrl}categories/${productId}`, { categoryIds }));
            console.log('Updated product categories:', productId);
        } catch (error) {
            console.error('Error updating product categories:', error);
            this.handleError(error);
            throw error;
           
        }
    }

    async removeProductFromCategories(productId: string): Promise<void> {
        try {
            await lastValueFrom(this.http.delete(`${appConfig.productsUrl}categories/${productId}`));
            console.log('Removed product from categories:', productId);
        } catch (error) {
            console.error('Error removing product from categories:', error);
            this.handleError(error);
            throw error;
            t
        }
    }

    async handleCategoryDeletion(categoryId: string): Promise<void> {
        try {
            await lastValueFrom(this.http.delete(`${appConfig.categoriesUrl}${categoryId}/products`));
            console.log('Removed category from all products:', categoryId);
        } catch (error) {
            console.error('Error removing category from products:', error);
            this.handleError(error);
            throw error;
            
        }
    }

    private handleError(error: any) {
        let errorMessage = 'An unknown error occurred!';
        if (error instanceof HttpErrorResponse) {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        } else if (error instanceof Error) {
            errorMessage = `Error: ${error.message}`;
        }
        console.error(errorMessage);
        notify.error(errorMessage);
    }



}